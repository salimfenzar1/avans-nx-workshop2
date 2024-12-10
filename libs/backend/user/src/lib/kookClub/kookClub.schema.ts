import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Kookclub {
  @IsMongoId()
  _id!: string;
  
  @Prop({ required: true })
  naam: string = '';

  @Prop({ required: true })
  beschrijving: string = '';

  @Prop({ type: [String], required: true })
  categorieen: string[] = []; // Een array van categorieën

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  eigenaar: { _id: string; name: string } | string = '';

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  leden: string[] = []; // Een array van gebruikers die lid zijn

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Recipe', default: [] }) // Recepten van de kookclub
  recepten: string[] = [];
}

export type KookclubDocument = Kookclub & Document & { _id: string };
export const KookclubSchema = SchemaFactory.createForClass(Kookclub);
