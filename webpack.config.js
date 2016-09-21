var config = {
   entry: './js/main.js',
	
   output: {
      path:'src',
      filename: 'js/index.js',
   },
	
   devServer: {
      inline: true,
      port: 8080,
      contentBase: './src'
   },
	
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   }
}

module.exports = config;
