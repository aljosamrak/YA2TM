import * as path from 'path'
import { Configuration, DefinePlugin, ProgressPlugin, SourceMapDevToolPlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

// webpack plugins
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// postcss plugins
// require('autoprefixer')
const isProd = (): boolean => {
  return process.env.NODE_ENV === 'production'
}

const alias = {
  'react-dom': '@hot-loader/react-dom',
}

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
]

const buildConfig: Configuration = {
  // mode: process.env.NODE_ENV || 'development',
  mode: 'development',
  entry: {
    background: path.join(__dirname, 'src', 'background', 'index.ts'),
    options: path.join(__dirname, 'src', 'options', 'index.tsx'),
    popup: path.join(__dirname, 'src', 'popup', 'index.tsx'),
    // devtools: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.js'),
    // panel: path.join(__dirname, 'src', 'pages', 'Panel', 'index.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist/build'),
    filename: '[name].js',
    clean: true,
  },
  // tslint:disable-next-line:no-object-literal-type-assertion
  module: {
    rules: [
      // compile ts
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
        loader: 'ts-loader',
        test: /\.(ts|tsx)$/,
      },
      // css loader
      // source maps are generated only for dev builds
      // css compression is only used for prod builds
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader'/*, options: { sourceMap: !isProd() }*/ },
          {
            loader: 'css-loader', /* options: {
              localIdentName: isProd() ? '[hash:base64]' : '[path][name]__[local]__[hash:base64:6]',
              minimize: isProd(),
              modules: true,
              sourceMap: !isProd(),
            },*/
          },
          {
            loader: 'sass-loader',
            options: {
              // plugins: () => [autoprefixer({
              //   browsers: [
              //     '>1%',
              //     'last 4 versions',
              //     'Firefox ESR',
              //     'not ie < 9',
              //   ],
              // })],
              sourceMap: !isProd(),
            },
          },
        ],
      },
      // file loader for media assets
      {
        exclude: [
          /\.(html?)$/,
          /\.(ts|tsx|js|jsx)$/,
          /\.css$/,
          /\.json$/,
        ],
        loader: 'file-loader',
        // query: {
        //   name: '[hash].[ext]',
        //   outputPath: 'media/',
        //   publicPath: 'build/',
        // },
      },
    ],
  } /*as webpack.NewModule*/,
  plugins: [
    new ProgressPlugin(),
    // pack common chunks
    // new CommonsChunkPlugin({
    //   chunks: ['popup', 'options'],
    //   minChunks: 2,
    //   name: 'common_for_ui',
    // }),
    // copy files in public to dist
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/manifest.json',
          to: path.join(__dirname, 'dist'),
          // force: true,
          // transform(content, path: string) {
          //   // generates the manifest file using the package.json informations
          //   return Buffer.from(
          //     JSON.stringify({
          //       description: process.env.npm_package_description,
          //       version: process.env.npm_package_version,
          //       ...JSON.parse(content.toString()),
          //     })
          //   );
        },
      ],
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'src/pages/Content/content.styles.css',
    //       to: path.join(__dirname, 'build'),
    //       force: true,
    //     },
    //   ],
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'assets', 'img', 'icon-128.png'),
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'src/assets/img/icon-34.png',
    //       to: path.join(__dirname, 'build'),
    //       force: true,
    //     },
    //   ],
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options', 'options.html'),
      filename: 'options.html',
      chunks: ['options'],
      cache: false,
    }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.html'),
    //   filename: 'devtools.html',
    //   chunks: ['devtools'],
    //   cache: false,
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'pages', 'Panel', 'index.html'),
    //   filename: 'panel.html',
    //   chunks: ['panel'],
    //   cache: false,
    // }),
  ],

      // context: 'public/',
      // from: {
      //   dot: false,
      //   glob: '**/*',
      // },
      // to: path.join(__dirname, 'dist/'),
  //   }]),
  // ],
  resolve: {
    alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    // extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  infrastructureLogging: {
    level: 'info',
  },
}

if (isProd()) {
  // Production build tweaks
  buildConfig.devtool = 'cheap-module-source-map'
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    new DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
    }),
    // clean output files
    new CleanWebpackPlugin(['dist']),
  ])
} else {
  buildConfig.devtool = 'cheap-module-source-map'
  // Development build tweaks
  // const buildConfigModule = buildConfig.module as webpack.NewModule
  // buildConfigModule.rules = (buildConfigModule.rules || []).concat([
  //   // tslint
  //   {
  //     enforce: 'pre',
  //     exclude: /node_modules/,
  //     loader: 'tslint-loader',
  //     test: /\.tsx?$/,
  //   },
  // ])
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    // exclude source mapping for vendor libs
    new SourceMapDevToolPlugin({
      exclude: /^vendor.*.\.js$/,
      filename: '[file].map',
    }),
  ])
  buildConfig.optimization = {
    minimize: true,
    minimizer: [
      // new TerserPlugin({
      //   extractComments: false,
      // }),
    ],
  }
}

export default buildConfig
