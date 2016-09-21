var config = {
   entry: './dev/js/index.js',
	
   output: {
      path:'src',
      filename: 'js/bundle.min.js',
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
