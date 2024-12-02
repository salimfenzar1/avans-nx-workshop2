import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RecipeCategory } from '@avans-nx-workshop/shared/api';

export type RecipeDocument = Recipe & Document;

class Ingredient {
  @Prop({ required: true })
  name: string = '';

  @Prop({ required: true })
  amount: string = ''; // Hoeveelheid in gram, ml, etc.
}

class Step {
  @Prop({ required: true })
  instruction: string = ''; // Beschrijving van de stap
}

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string = '';

  @Prop({ required: true })
  description: string = '';

  @Prop({
    required: true,
    enum: RecipeCategory,
    type: String,
  })
  category: RecipeCategory | undefined;

  @Prop({ type: [Ingredient], required: true })
  ingredients: Ingredient[] | undefined;

  @Prop({ type: [Step], required: true })
  steps: Step[] | undefined;

  @Prop({ required: true })
  cookingTime: number = 0; // Tijd in minuten

  @Prop({ default: Date.now })
  createdAt: Date = new Date();

  @Prop({ required: true })
  userid: string = '';

  @Prop({ required: false })
  imageUrl?: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
