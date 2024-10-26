const path = require('path');

module.exports = {
  entry: './src/index.ts', // Entry point of your server application
  target: 'node',           // Webpack should bundle for Node.js, not browser
  mode: 'development',       // Can also be 'development' or 'production'
  output: {
    path: path.resolve(__dirname, '..', 'dist'),  // Output directory
    filename: 'index.js',                   // Output file
  },
  resolve: {
    extensions: ['.ts', '.js'],             // Resolve these extensions
  },
  externals: {
    'discord.js': 'commonjs discord.js',  // Expect 'discord.js' to be available via require at runtime
    'uuid': 'commonjs uuid',
    'dotenv': 'commonjs dotenv',
    'express': 'commonjs express',
    'multer': 'commonjs multer',
    'request': 'commonjs request',
    'socket.io': 'commonjs socket.io',
    'steam-user': 'commonjs steam-user',
    'web-streams-polyfill': 'commonjs web-streams-polyfill'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,                      // Use ts-loader for .ts files
        use: 'ts-loader',
        exclude: /node_modules/,            // Exclude node_modules from transpiling
      },
      {
        test: /\.node/,
        use: 'node-loader'
      }
    ],
  }
};