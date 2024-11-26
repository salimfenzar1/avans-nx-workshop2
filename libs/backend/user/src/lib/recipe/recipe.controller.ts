import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.schema';
import { AuthGuard } from '@avans-nx-workshop/backend/auth';
import { AuthenticatedRequest } from '@avans-nx-workshop/backend/auth'; 

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(AuthGuard) 
  async create(
    @Body() recipeData: Partial<Recipe>,
    @Request() req: AuthenticatedRequest 
  ): Promise<Recipe> {
    const userId = req.user.user_id; 
    recipeData.userid = userId; 
    console.log('Recipe data being sent to the service:', recipeData);
    return this.recipeService.create(recipeData);
  }

  @Get()
  async findAll(): Promise<Recipe[]> {
    return this.recipeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Recipe | null> {
    return this.recipeService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard) // Beveilig de update-methode
  async update(
    @Param('id') id: string,
    @Body() recipeData: Partial<Recipe>,
    @Request() req: AuthenticatedRequest // Gebruik het aangepaste request-type
  ): Promise<Recipe | null> {
    const userId = req.user.user_id;
    return this.recipeService.update(id, recipeData, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard) // Beveilig de delete-methode
  async delete(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest // Gebruik het aangepaste request-type
  ): Promise<boolean> {
    const userId = req.user.user_id;
    return this.recipeService.delete(id, userId);
  }
}
