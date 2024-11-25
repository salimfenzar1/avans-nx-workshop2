import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,

  ROOT_DOMAIN_URL: 'https://my-app-api.azurewebsites.net', 
  dataApiUrl: 'https://my-app-api.azurewebsites.net/api',       
  MONGO_DB_CONNECTION_STRING: 'mongodb+srv://salimfenzar:Eastpak10@cluster0.whzhx.mongodb.net/recipe?retryWrites=true&w=majority'  
};
