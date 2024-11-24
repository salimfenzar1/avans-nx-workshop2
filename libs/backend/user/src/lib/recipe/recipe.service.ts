import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>) {}

  async create(recipeData: Partial<Recipe>): Promise<Recipe> {
    const newRecipe = new this.recipeModel(recipeData);
    return newRecipe.save();
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.find().exec();
  }

  async findById(id: string): Promise<Recipe | null> {
    return this.recipeModel.findById(id).exec();
  }

  async update(id: string, recipeData: Partial<Recipe>): Promise<Recipe | null> {
    return this.recipeModel.findByIdAndUpdate(id, recipeData, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.recipeModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
