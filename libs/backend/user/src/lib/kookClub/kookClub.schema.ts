import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Kookclub {
  @Prop({ required: true })
  naam: string = '';

  @Prop({ required: true })
  beschrijving: string = '';

  @Prop({ type: [String], required: true })
  categorieen: string[] = []; // Een array van categorieën

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  eigenaar: string = ''; // Referentie naar de eigenaar (gebruiker)

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  leden: string[] = []; // Een array van gebruikers die lid zijn

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Recipe', default: [] }) // Recepten van de kookclub
  recepten: string[] = [];
}

export type KookclubDocument = Kookclub & Document;
export const KookclubSchema = SchemaFactory.createForClass(Kookclub);
