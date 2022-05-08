import type { Configuration } from 'webpack'

module.exports = {
  entry: { background: 'src/background.ts' },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    fallback: {
      http: false,
      https: false,
    },
  },
} as Configuration
