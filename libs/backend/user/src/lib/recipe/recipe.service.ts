import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';
import { ReviewService } from '../review/review.service';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  private reviewService: ReviewService) {}

  async create(recipeData: Partial<Recipe>): Promise<Recipe> {
    const newRecipe = new this.recipeModel(recipeData);
    return newRecipe.save();
  }

async findAll(): Promise<(Recipe & { averageRating: number })[]> {
  const recipes = await this.recipeModel.find().exec();

  const recipesWithRatings = await Promise.all(
    recipes.map(async (recipe: RecipeDocument) => {
      const recipeId = recipe._id.toString(); 
      const averageRating = await this.reviewService.getAverageRating(recipeId);
      return {
        ...recipe.toObject(),
        averageRating,
      };
    })
  );

  return recipesWithRatings;
}

  

  async findById(id: string): Promise<Recipe | null> {
    return this.recipeModel.findById(id).exec();
  }
  async update(id: string, recipeData: Partial<Recipe>, userId: string): Promise<Recipe | null> {
    const recipe = await this.findById(id);
    if (!recipe || recipe.userid !== userId) {
      throw new UnauthorizedException('Not authorized to edit this recipe');
    }
    return this.recipeModel.findByIdAndUpdate(id, recipeData, { new: true }).exec();
  }
  

  async delete(id: string, userId: string): Promise<boolean> {
    const recipe = await this.findById(id);
    if (!recipe || recipe.userid !== userId) {
      throw new UnauthorizedException('Not authorized to delete this recipe');
    }
    const result = await this.recipeModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
  
}
