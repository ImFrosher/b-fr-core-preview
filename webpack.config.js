const webpack = require('webpack');
const path = require('path');
const RemovePlugin = require('remove-files-webpack-plugin');
var WebpackObfuscator = require('webpack-obfuscator');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const buildPath = path.resolve(__dirname, 'dist');

const server = {
  entry: ['./src/server/server.ts', './src/server/misc.ts', './src/server/player.ts', './src/server/database.ts'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'eslint-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new RemovePlugin({
      before: {
        include: [
          path.resolve(buildPath, 'server')
        ]
      },
      watch: {
        include: [
          path.resolve(buildPath, 'server')
        ]
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
          { from: 'src/server/static' }
      ]
  })
  ],
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[contenthash].server.js',
    path: path.resolve(buildPath, 'server')
  },
  target: 'node',
};

const client = {
  entry: './src/client/client.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'eslint-loader'],
        exclude: /node_modules/,

      },
    ],
  },
  plugins: [
    new RemovePlugin({
      before: {
        include: [
          path.resolve(buildPath, 'client')
        ]
      },
      watch: {
        include: [
          path.resolve(buildPath, 'client')
        ]
      }
    }),
    new WebpackObfuscator({ // Obfuscate client-side code, so it is harder to reverse engineer, and possibly cheat.
      selfDefending: false,
      simplify: true,
      compact: true,
      controlFlowFlattening: false,
      controlFlowFlatteningThreshold: 0.75,
      renameProperties: false,
      renamePropertiesMode: 'safe',
      splitStrings: false,
      splitStringsChunkLength: 10,
      stringArray: true,
      rotateStringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 0.75,
      stringArrayEncoding: [],
      stringArrayIndexesType: [
          'hexadecimal-number'
      ],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: 'variable',
      target: 'node'
    }, [])
  ],
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[contenthash].client.js',
    path: path.resolve(buildPath, 'client'),
  },
};

module.exports = [server, client];
