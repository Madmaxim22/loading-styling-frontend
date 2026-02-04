import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { GenerateSW } from 'workbox-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html'), }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
      chunkFilename: 'css/style.css',
    }),
    new CopyWebpackPlugin({
 patterns: [
 {
 from: 'LICENSE', to: '.'
}
],
}),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'google-fonts-stylesheets', },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 год
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 дней
            },
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        resolve: { fullySpecified: false },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ],
            sourceMaps: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: false },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  devtool: 'source-map',
  devServer: {
    port: 5000,
    open: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
    server: 'http',
  },
};
