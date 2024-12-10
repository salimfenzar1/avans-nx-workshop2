import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Neo4jModule } from 'nest-neo4j';
import { RecipeNeo4jService } from './neo4j-recipe.service';
import { RecipeNeo4jController } from './neo4j-recipe.controller';
import { Recipe, RecipeSchema, ReviewModule } from '@avans-nx-workshop/backend/user';
import { User, UserSchema } from '@avans-nx-workshop/backend/user';
import { RecipeService, UserService } from '@avans-nx-workshop/backend/user';

@Module({
  imports: [
    Neo4jModule,
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ReviewModule
  ],
  controllers: [RecipeNeo4jController],
  providers: [RecipeNeo4jService, RecipeService, UserService],
  exports: [RecipeNeo4jService],
})
export class RecipeNeo4jModule {}
