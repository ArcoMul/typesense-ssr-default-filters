const path = require('path')

module.exports = {
  pluginOptions: {
    ssr: {
      nodeExternalsWhitelist: [
        /\.css$/,
        /\?vue&type=style/,
        /vue-instantsearch/,
        /instantsearch.js/,
      ],
      copyUrlOnStart: false,
      distPath: path.resolve(__dirname, './public'),
    },
  },
};
