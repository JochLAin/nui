const path = require('path');
const pkg = require(path.resolve(__dirname, 'package.json'));

module.exports = {
  entry: "./assets/bootstrap.ts",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "public/build"),
    filename: "bootstrap.js",
    clean: true,
  },
  module: {
    rules: [{
      test: /\.md$/,
      loader: 'raw-loader'
    }, {
      test: /\.s[ac]ss$/i,
      include: [path.resolve(__dirname, 'src')],
      use: [
        "raw-loader",
        {
          loader: "sass-loader",
          options: {
            implementation: require('sass'),
            sassOptions: { outputStyle: 'compressed' },
          }
        },
      ],
    }, {
      test: /\.s[ac]ss$/i,
      exclude: [path.resolve(__dirname, 'src')],
      use: [
        "style-loader",
        "css-loader",
        "sass-loader",
      ],
    }, {
      test: /\.svg$/,
      loader: 'url-loader'
    }, {
      test: /\.([em]?[jt]sx?)$/,
      use: 'ts-loader',
    }],
  },
  devtool: 'eval-source-map',
  devServer: {
    allowedHosts: 'all',
    client: {
      progress: false,
      webSocketURL: `ws://127.0.0.1:${process.env.PORT_WEBPACK || 36902}/ws`,
    },
    compress: true,
    host: '0.0.0.0',
    port: process.env.PORT_WEBPACK,
    hot: true,
    liveReload: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.json', '.html', '.md', '.wasm'],
    alias: {
      '@nui-forms': path.resolve(__dirname, 'src/forms'),
      '@nui-themes': path.resolve(__dirname, 'src/themes'),
      '@nui-tools': path.resolve(__dirname, 'src/tools'),
      '@nui': path.resolve(__dirname, 'src/components'),
    },
  },
  experiments: {
    asyncWebAssembly: true,
  }
};
