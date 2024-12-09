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
  

  async findById(id: string): Promise<KookclubDocument & { eigenaar: { _id: string; name: string } }> {
    const kookclub = await this.kookclubModel
      .findById(id)
      .populate('eigenaar', '_id name') // Populeer eigenaar als object met _id en name
      .populate('recepten', 'title description') // Populeer recepten met de gewenste velden
      .exec();
  
    if (!kookclub) {
      throw new NotFoundException('Kookclub niet gevonden');
    }
  
    return kookclub as KookclubDocument & { eigenaar: { _id: string; name: string } };
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
  
    // Zorg ervoor dat `lid` als string wordt vergeleken
    kookclub.leden = kookclub.leden.filter((lid) => lid.toString() !== userId);
  
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
    if (typeof kookclub.eigenaar === 'object') {
      if (kookclub.eigenaar._id.toString() !== userId) {
        throw new UnauthorizedException('Alleen de eigenaar kan de kookclub bewerken');
      }
    } else if (kookclub.eigenaar !== userId) {
      throw new UnauthorizedException('Alleen de eigenaar kan de kookclub bewerken');
    }
    await this.kookclubModel.findByIdAndDelete(kookclubId).exec();
  }
  async updateKookclub(kookclubId: string, userId: string, data: Partial<Kookclub>): Promise<Kookclub> {
    const kookclub = await this.findById(kookclubId);
  
    // Controleer eigenaarschap
    if (typeof kookclub.eigenaar === 'object') {
      if (kookclub.eigenaar._id.toString() !== userId) {
        throw new UnauthorizedException('Alleen de eigenaar kan de kookclub bewerken');
      }
    } else if (kookclub.eigenaar !== userId) {
      throw new UnauthorizedException('Alleen de eigenaar kan de kookclub bewerken');
    }
    
  
    // Update de velden
    if (data.naam !== undefined) kookclub.naam = data.naam;
    if (data.beschrijving !== undefined) kookclub.beschrijving = data.beschrijving;
    if (data.categorieen !== undefined) kookclub.categorieen = data.categorieen;
  
    return kookclub.save();
  }
  
  
  
}
