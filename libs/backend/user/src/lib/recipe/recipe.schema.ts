import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RecipeCategory } from '@avans-nx-workshop/shared/api';
import { IsMongoId } from 'class-validator';

export type RecipeDocument = Recipe & Document & { _id: Types.ObjectId };

class Ingredient {
  @Prop({ required: true })
  name: string = '';

  @Prop({ required: true })
  amount: string = ''; 
}

class Step {
  @Prop({ required: true })
  instruction: string = '';
}

@Schema()
export class Recipe {

  @IsMongoId()
  _id!: string;

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
  cookingTime: number = 0; 

  @Prop({ default: Date.now })
  createdAt: Date = new Date();

  @Prop({ required: true })
  userid: string = '';

  @Prop({ required: false })
  imageUrl?: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
