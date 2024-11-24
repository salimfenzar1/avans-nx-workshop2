import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string = '';

  @Prop({ required: true })
  description: string = '';

  @Prop({ required: true })
  ingredients: string[] = []; // Array of ingredients

  @Prop({ required: true })
  steps: string[] = []; // Array of cooking steps

  @Prop({ required: true })
  cookingTime: number = 0; // Time in minutes

  @Prop({ default: Date.now })
  createdAt: Date = new Date();

  @Prop({ required: false })
  imageUrl?: string; // Optional recipe image
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
