import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,

  ROOT_DOMAIN_URL: process.env.ROOT_DOMAIN_URL || 'https://nice-stone-02d194903.5.azurestaticapps.net',
  dataApiUrl: process.env.DATA_API_URL || 'https://nice-stone-02d194903.5.azurestaticapps.net/api',

  MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING || '', 
};
