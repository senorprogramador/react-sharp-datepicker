if (process.env.npm_lifecycle_script.includes('production')) {
  module.exports = {
    entry: {
      main: './src/index.js'
    },
    output: {
      filename: 'index.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [/node_modules/, /src\/App.jsx/],
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ]
    },
    plugins: [
    ]
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
        filename: "./src/index.html"
      })
    ]
  };
}
