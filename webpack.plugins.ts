import relocateLoader from '@vercel/webpack-asset-relocator-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  {
    apply(compiler: any) {
      compiler.hooks.compilation.tap('webpack-asset-relocator-loader', (compilation: any) => {
        relocateLoader.initAssetCache(compilation, 'native_modules');
      });
    },
  },
];
