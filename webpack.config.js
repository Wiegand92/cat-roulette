const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// In dev mode if not env.NODE_ENV is not production
const devMode = process.env.NODE_ENV !== 'production';
const plugins = [new CleanWebpackPlugin()];
if (process.env.NODE_ENV === 'production') {
  // Enable in production only
  plugins.push(new MiniCssExtractPlugin({
    filename:'style.css'
  }));
}

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public/scripts')
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        resolve: {
          extensions: ['.js', '.jsx']
        },
        exclude: /node_modules/,
        use: [
          {
            loader: "source-map-loader"
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env','@babel/preset-react'],
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          //If we're in dev-mode, use inline-styles, else extract to separate css file
          devMode ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/scripts/',
            }
          },
          'css-loader',
          'sass-loader'
        ]
      } 
    ]
  },
  devServer: {
    proxy: {'/' : 'http://localhost:4200'},
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/scripts/',
    inline: true,
    hot: true,
    watchContentBase: true
  },
  devtool: 'cheap-module-source-map'
}