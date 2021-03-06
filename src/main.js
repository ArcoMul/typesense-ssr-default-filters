import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createServerRootMixin } from 'vue-instantsearch';
// import algoliasearch from 'algoliasearch/lite';
import qs from 'qs';
import _renderToString from 'vue-server-renderer/basic';
import { createHmac } from 'crypto'

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

function generateScopedSearchKey(searchKey, parameters) {
  // Note: only a key generated with the `documents:search` action will be
  // accepted by the server, when usined with the search endpoint.
  const paramsJSON = JSON.stringify(parameters)
  const digest = Buffer.from(createHmac('sha256', searchKey).update(paramsJSON).digest('base64'))
  const keyPrefix = searchKey.substr(0, 4)
  const rawScopedKey = `${digest}${keyPrefix}${paramsJSON}`
  return Buffer.from(rawScopedKey).toString('base64')
}

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: generateScopedSearchKey("8hLCPSQTYcBuK29zY5q6Xhin7ONxHy99", { filter_by: 'release_decade:1960s' }), // Be sure to use the search-only-api-key
    // apiKey: "8hLCPSQTYcBuK29zY5q6Xhin7ONxHy99",
    nodes: [
      {
        host: "qtg5aekc2iosjh93p.a1.typesense.net",
        port: "443",
        protocol: "https"
      }
    ]
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    query_by: "title",
  }
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

function renderToString(app) {
  return new Promise((resolve, reject) => {
    _renderToString(app, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

// const searchClient = algoliasearch(
//   'latency',
//   '6be0576ff61c053d5f9a3225e2a90f76'
// );

Vue.config.productionTip = false;

export async function createApp({
  beforeApp = () => {},
  afterApp = () => {},
  context,
} = {}) {
  const router = createRouter();

  await beforeApp({
    router,
  });

  const app = new Vue({
    mixins: [
      createServerRootMixin({
        searchClient,
        indexName: 'songs_1630520530850',
        routing: {
          router: {
            read() {
              const url = context
                ? context.url
                : typeof window.location === 'object'
                  ? window.location.href
                  : '';
              const search = url.slice(url.indexOf('?'));

              return qs.parse(search, {
                ignoreQueryPrefix: true,
              });
            },
            write(routeState) {
              const query = qs.stringify(routeState, {
                addQueryPrefix: true,
              });

              if (typeof history === 'object') {
                history.pushState(routeState, null, query);
              }
            },
            createURL(routeState) {
              const query = qs.stringify(routeState, {
                addQueryPrefix: true,
              });

              return query;
            },
            onUpdate(callback) {
              if (typeof window !== 'object') {
                return;
              }
              this._onPopState = event => {
                if (this.writeTimer) {
                  window.clearTimeout(this.writeTimer);
                  this.writeTimer = undefined;
                }

                const routeState = event.state;

                // At initial load, the state is read from the URL without update.
                // Therefore the state object is not available.
                // In this case, we fallback and read the URL.
                if (!routeState) {
                  callback(this.read());
                } else {
                  callback(routeState);
                }
              };

              window.addEventListener('popstate', this._onPopState);
            },
            dispose() {
              if (this._onPopState && typeof window == 'object') {
                window.removeEventListener('popstate', this._onPopState);
              }

              // we purposely don't write on dispose, to prevent double entries on navigation
            },
          },
        },
        // other options, like
        // stalledSearchDelay: 50
      }),
    ],
    serverPrefetch() {
      return this.instantsearch.findResultsState({ component: this, renderToString });
    },
    beforeMount() {
      if (typeof window === 'object' && window.__ALGOLIA_STATE__) {
        this.instantsearch.hydrate(window.__ALGOLIA_STATE__);
        delete window.__ALGOLIA_STATE__;
      }
    },
    router,
    render: h => h(App),
  });

  const result = {
    app,
    router,
  };

  await afterApp(result);

  return result;
}
