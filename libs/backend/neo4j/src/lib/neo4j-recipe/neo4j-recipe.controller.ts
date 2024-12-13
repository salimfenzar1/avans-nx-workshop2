import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecipeNeo4jService } from './neo4j-recipe.service';

@ApiTags('Neo4j Recipes') 
@Controller('neo4j/recipes')
export class RecipeNeo4jController {
  constructor(private readonly recipeNeo4jService: RecipeNeo4jService) {}

  @ApiOperation({ summary: 'Synchroniseer recepten met Neo4j' })
  @Post('sync')
  async syncRecipes() {
    await this.recipeNeo4jService.syncRecipes();
    return { message: 'Recepten gesynchroniseerd naar Neo4j' };
  }

  @ApiOperation({ summary: 'Haal populairste recepten op' })
  @Get('popular')
  async getPopularRecipes() {
    return this.recipeNeo4jService.getPopularRecipes();
  }

  @ApiOperation({ summary: 'Haal best beoordeelde recepten op' })
  @Get('best-rated')
  async getBestRatedRecipes() {
    return this.recipeNeo4jService.getBestRatedRecipes();
  }

  @ApiOperation({ summary: 'Verwijder een recept uit Neo4j' })
  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    await this.recipeNeo4jService.deleteRecipeFromNeo4j(id);
    return { message: `Recept met ID ${id} verwijderd uit Neo4j` };
  }

  
}