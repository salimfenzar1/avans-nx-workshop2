import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string = '';

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Recipe', required: true })
  recipe: string = '';

  @Prop({ type: Number, required: true, min: 1, max: 5 }) 
  rating: number = 0;

  @Prop({ type: String, required: false })
  comment: string = '';
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);
