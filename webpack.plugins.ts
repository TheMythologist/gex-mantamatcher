import type { Configuration } from 'webpack';
import relocateLoader from '@vercel/webpack-asset-relocator-loader';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const plugins: Configuration['plugins'] = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  {
    apply(compiler) {
      compiler.hooks.compilation.tap('webpack-asset-relocator-loader', compilation => {
        relocateLoader.initAssetCache(compilation, 'native_modules');
      });
    },
  },
];

export default plugins;
