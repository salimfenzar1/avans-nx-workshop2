import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KookclubModule, UsersModule } from '@avans-nx-workshop/backend/user';
import { AuthModule } from '@avans-nx-workshop/backend/auth';
import { RecipeModule, ReviewModule } from '@avans-nx-workshop/backend/user';
import * as path from 'path';
import { environment } from '@avans-nx-workshop/shared/util-env'; 


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => environment],
      isGlobal: true, 
    }),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_CONNECTION_STRING'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            Logger.verbose(
              `Mongoose db connected to ${configService.get<string>('MONGO_DB_CONNECTION_STRING')}`
            );
          });
          connection._events.connected();
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RecipeModule,
    ReviewModule,
    KookclubModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}