import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kookclub, KookclubDocument } from './kookClub.schema';

@Injectable()
export class KookclubService {
  constructor(
    @InjectModel(Kookclub.name) private readonly kookclubModel: Model<KookclubDocument>
  ) {}

  async createKookclub(data: Partial<Kookclub>, userId: string): Promise<Kookclub> {
    const newKookclub = new this.kookclubModel({ ...data, eigenaar: userId });
    return newKookclub.save();
  }

  async findAll(): Promise<Kookclub[]> {
    return this.kookclubModel
      .find()
      .populate('eigenaar', 'name')
      .populate('leden', 'name') 
      .populate('recepten', 'title description') 
      .exec();
  }
  

  async findById(id: string): Promise<KookclubDocument> {
    const kookclub = await this.kookclubModel
      .findById(id)
      .populate('eigenaar', 'name _id') // Populeer eigenaar als object met name en _id
      .populate('recepten', 'title description') // Populeer recepten met de gewenste velden
      .exec();
  
    if (!kookclub) {
      throw new NotFoundException('Kookclub niet gevonden');
    }
  
    return kookclub;
  }
  

  async joinKookclub(kookclubId: string, userId: string): Promise<Kookclub> {
    const kookclub = await this.findById(kookclubId);
    if (!kookclub.leden.includes(userId)) {
      kookclub.leden.push(userId);
      return kookclub.save();
    }
    throw new UnauthorizedException('Je bent al lid van deze kookclub');
  }

  async leaveKookclub(kookclubId: string, userId: string): Promise<Kookclub> {
    const kookclub = await this.findById(kookclubId);
    kookclub.leden = kookclub.leden.filter((lid) => lid !== userId);
    return kookclub.save();
  }

  async addRecipeToKookclub(kookclubId: string, recipeId: string): Promise<Kookclub> {
    const kookclub = await this.findById(kookclubId);
    if (!kookclub.recepten.includes(recipeId)) {
      kookclub.recepten.push(recipeId);
      return kookclub.save();
    }
    throw new UnauthorizedException('Dit recept is al toegevoegd aan deze kookclub');
  }

  async deleteKookclub(kookclubId: string, userId: string): Promise<void> {
    const kookclub = await this.findById(kookclubId);
    if (kookclub.eigenaar.toString() !== userId) {
      throw new UnauthorizedException('Alleen de eigenaar kan de kookclub verwijderen');
    }
    await this.kookclubModel.findByIdAndDelete(kookclubId).exec();
  }
}
