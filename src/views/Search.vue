<template>
  <ais-instant-search-ssr>
    <ais-configure :facets="['release_decade']" />
    <ais-search-box />
    <ais-stats />
    Genres:
    <ais-refinement-list attribute="genres" />
    <ais-hits>
      <template v-slot:item="{ item }">
        <p>
          <ais-highlight
            attribute="title"
            :hit="item"
          />
        </p>
        <p>
          <ais-highlight
            attribute="primary_artist_name"
            :hit="item"
          />, {{ item.genres }}, {{ item.release_decade }}
        </p>
      </template>
    </ais-hits>
    <ais-pagination />
  </ais-instant-search-ssr>
</template>

<script>
import {
  AisInstantSearchSsr,
  AisRefinementList,
  AisHits,
  AisHighlight,
  AisSearchBox,
  AisStats,
  AisPagination,
  AisConfigure,
} from 'vue-instantsearch';

export default {
  components: {
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination,
    AisConfigure,
  },
};
</script>

<style>
.ais-Hits-list {
  text-align: left;
}
</style>
