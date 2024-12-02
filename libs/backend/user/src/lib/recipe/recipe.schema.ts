import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RecipeCategory } from '@avans-nx-workshop/shared/api';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string = '';

  @Prop({ required: true })
  description: string = '';

  @Prop({ 
    required: true, 
    enum: RecipeCategory, 
    type: String
  })
  category: RecipeCategory | undefined;

  @Prop({ required: true })
  ingredients: string[] = []; 

  @Prop({ required: true })
  steps: string[] = [];

  @Prop({ required: true })
  cookingTime: number = 0; 

  @Prop({ default: Date.now })
  createdAt: Date = new Date();
  
  @Prop({ required: true })
  userid: string = '';

  @Prop({ required: false })
  imageUrl?: string; 
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
