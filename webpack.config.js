const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

const config = {
  entry: {
    window: './src/window.js',
    aw: './src/aw.js'
  },
  output: {
    path: path.resolve(__dirname, 'www/js'),
    filename: '[name].bundle.js'
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [new ESLintPlugin()]
}

module.exports = config
