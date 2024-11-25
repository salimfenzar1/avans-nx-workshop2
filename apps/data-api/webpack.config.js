const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = composePlugins(withNx(), (config) => {
  return {
    ...config,
    entry: './apps/data-api/src/main.ts', // De entrypoint van je NestJS-app
    target: 'node', // Specifiek voor een Node.js-applicatie
    externals: [nodeExternals()], // Zorgt ervoor dat Node-modules niet worden gebundeld
    output: {
      path: path.resolve(__dirname, '../../dist/apps/data-api'), // Uitvoermap
      filename: 'main.js', // Naam van de gebundelde uitvoer
    },
    resolve: {
      extensions: ['.ts', '.js'], // Zorg dat TypeScript-bestanden correct worden verwerkt
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader', // Gebruik TypeScript loader
          exclude: /node_modules/, // Sluit node_modules uit
        },
      ],
    },
  };
});
