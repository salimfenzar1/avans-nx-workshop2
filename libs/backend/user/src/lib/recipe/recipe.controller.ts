import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.schema';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  async create(@Body() recipeData: Partial<Recipe>): Promise<Recipe> {
    try {
      // Controleer of de data valide is
      if (!recipeData.title || !recipeData.description) {
        throw new Error('Title and description are required.');
      }
  
      // Sla het recept op
      const newRecipe = await this.recipeService.create(recipeData);
      if (!newRecipe) {
        throw new Error('Error creating the recipe.');
      }
      return newRecipe;
    } catch (error: any) { // Cast de error als 'any'
      throw new Error(`Failed to create recipe: ${error.message}`);
    }
  }
  
  

  @Get()
  async findAll(): Promise<Recipe[]> {
    return this.recipeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Recipe | null>  {
    return this.recipeService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() recipeData: Partial<Recipe>
  ): Promise<Recipe | null> {
    const updatedRecipe = await this.recipeService.update(id, recipeData);
    if (!updatedRecipe) {
      throw new Error(`Recipe with ID ${id} not found`);
    }
    return updatedRecipe;
  }
  

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.recipeService.delete(id);
  }
  
}
