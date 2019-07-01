const path = require('path');

if (process.env.npm_lifecycle_script.includes('production')) {
  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'index.js',
      libraryTarget: 'commonjs2' // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: [/(node_modules|bower_components|build)/,/src\/App.jsx/],
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          exclude: /(node_modules|bower_components|build)/,
          use: ['style-loader', 'css-loader'],
        },
      ]
    },
    externals: {
      'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    }
  };
}
else {
  const HtmlWebPackPlugin = require("html-webpack-plugin");
  module.exports = {
    entry: {
      main: './src/App.jsx'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      })
    ]
  };
}
