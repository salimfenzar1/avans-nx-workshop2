import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,

  ROOT_DOMAIN_URL: 'https://data-api-recipe-ajbbe7arg3ckh0du.westeurope-01.azurewebsites.net/',
  dataApiUrl: 'https://data-api-recipe-ajbbe7arg3ckh0du.westeurope-01.azurewebsites.net/api',
  MONGO_DB_CONNECTION_STRING: 'mongodb+srv://salimfenzar:Eastpak10@cluster0.whzhx.mongodb.net/recipe?retryWrites=true&w=majority',

  NEO4J_USER: '',
  NEO4J_PASSWORD: 'beg9ckdHG15BhSlV7hEVh8SQSKLwHnrQhTlyUlqnGGs',
  neo4jApiUrl: ''
};
