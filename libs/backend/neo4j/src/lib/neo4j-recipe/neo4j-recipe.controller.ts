import { Controller, Get, Post } from '@nestjs/common';
import { RecipeNeo4jService } from './neo4j-recipe.service';

@Controller('neo4j/recipes')
export class RecipeNeo4jController {
  constructor(private readonly recipeNeo4jService: RecipeNeo4jService) {}

  // Synchroniseer recepten
  @Post('sync')
  async syncRecipes() {
    await this.recipeNeo4jService.syncRecipes();
    return { message: 'Recepten gesynchroniseerd naar Neo4j' };
  }

  // Haal populairste recepten op
  @Get('popular')
  async getPopularRecipes() {
    return this.recipeNeo4jService.getPopularRecipes();
  }

  @Get('best-rated')
  async getBestRatedRecipes() {
    return this.recipeNeo4jService.getBestRatedRecipes();
  }
}
