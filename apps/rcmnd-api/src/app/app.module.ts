import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { Neo4jModule } from 'nest-neo4j/dist';
import {ConfigModule} from '@nestjs/config'
import { Neo4jBackendModule } from '@avans-nx-workshop/backend/neo4j';
import { RecipeNeo4jModule } from '@avans-nx-workshop/backend/neo4j';
import { environment } from '@avans-nx-workshop/shared/util-env';

@Module({
  imports: [
    MongooseModule.forRoot(environment.MONGO_DB_CONNECTION_STRING),
    Neo4jModule.forRoot({
      scheme: 'neo4j+s',
      host: 'da357a49.databases.neo4j.io',
      port: 7687,
      username: 'neo4j',
      password: environment.NEO4J_PASSWORD,
    }),
    RecipeNeo4jModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
