import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeController } from './recipe/recipe.controller';
import { RecipeService } from './recipe/recipe.service';
import { Recipe, RecipeSchema } from './recipe/recipe.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService], // Exporting RecipeService for use in other modules
})
export class RecipeModule {}
