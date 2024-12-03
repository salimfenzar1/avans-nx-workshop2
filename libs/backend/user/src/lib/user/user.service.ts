import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel, UserDocument } from './user.schema';
import { IUser, IUserInfo } from '@avans-nx-workshop/shared/api';
// import { Meal, MealDocument } from '@avans-nx-workshop/backend/features';
import { CreateUserDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument> // @InjectModel(Meal.name) private meetupModel: Model<MealDocument>
    ) {}

    async findAll(): Promise<IUserInfo[]> {
        this.logger.log(`Finding all items`);
        const items = await this.userModel.find();
        return items;
    }

    async findOne(_id: string): Promise<IUser | null> {
        this.logger.log(`Finding user with id ${_id}`);
        if (!Types.ObjectId.isValid(_id)) {
            this.logger.error(`Invalid ObjectId: ${_id}`);
            throw new HttpException(`Invalid ID format`, 400);
        }
        const item = await this.userModel.findById(new Types.ObjectId(_id)).exec();
        if (!item) {
            this.logger.debug('Item not found');
            throw new HttpException('User not found', 404);
        }
        return item;
    }

    async findOneByEmail(email: string): Promise<IUserInfo | null> {
        this.logger.log(`Finding user by email ${email}`);
        const item = this.userModel
            .findOne({ emailAddress: email })
            .select('-password')
            .exec();
        return item;
    }

    async create(user: CreateUserDto): Promise<IUserInfo> {
        this.logger.log(`Create user ${user.name}`);
        const createdItem = this.userModel.create(user);
        return createdItem;
    }



    async update(_id: string, user: UpdateUserDto): Promise<IUserInfo | null> {
        this.logger.log(`Updating user with ID: ${_id}`);
        this.logger.log(`Received update payload: ${JSON.stringify(user)}`);
    
        if (!Types.ObjectId.isValid(_id)) {
            this.logger.error(`Invalid ObjectId format: ${_id}`);
            throw new HttpException('Invalid ID format', 400);
        }
    
        const objectId = new Types.ObjectId(_id);
        const updatedUser = await this.userModel.findByIdAndUpdate(
            objectId,
            user,
            { new: true }
        );
    
        if (!updatedUser) {
            this.logger.error(`User with ID ${_id} not found`);
            throw new HttpException(`User with ID ${_id} not found`, 404);
        }
    
        this.logger.log(`User updated successfully: ${JSON.stringify(updatedUser)}`);
        return updatedUser;
    }

    async addFavorite(userId: string, recipeId: string): Promise<IUserInfo | null> {
        this.logger.log(`Adding recipe ${recipeId} to user ${userId} favorites`);
    
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(recipeId)) {
            this.logger.error(`Invalid ObjectId format for userId: ${userId} or recipeId: ${recipeId}`);
            throw new HttpException('Invalid ID format', 400);
        }
    
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            this.logger.error(`User with ID ${userId} not found`);
            throw new HttpException(`User with ID ${userId} not found`, 404);
        }
    
        if (!user.favorites.includes(recipeId)) {
            user.favorites.push(recipeId);
            await user.save();
            this.logger.log(`Recipe ${recipeId} added to favorites`);
        } else {
            this.logger.log(`Recipe ${recipeId} already in favorites`);
        }
    
        return user;
    }
    
    async getFavorites(userId: string): Promise<any> {
        this.logger.log(`Fetching favorites for user ${userId}`);
      
        if (!Types.ObjectId.isValid(userId)) {
          this.logger.error(`Invalid ObjectId format for userId: ${userId}`);
          throw new HttpException('Invalid ID format', 400);
        }
      
        const user = await this.userModel
          .findById(userId)
          .populate('favorites') // Dit koppelt de recepten aan de favorieten
          .exec();
      
        if (!user) {
          this.logger.error(`User with ID ${userId} not found`);
          throw new HttpException(`User with ID ${userId} not found`, 404);
        }
        return user.favorites; // Stuur alleen de lijst van recepten terug
      }
      
      async removeFavorite(userId: string, recipeId: string): Promise<IUserInfo | null> {
        this.logger.log(`Removing recipe ${recipeId} from user ${userId} favorites`);
      
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(recipeId)) {
          this.logger.error(`Invalid ObjectId format for userId: ${userId} or recipeId: ${recipeId}`);
          throw new HttpException('Invalid ID format', 400);
        }
      
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
          this.logger.error(`User with ID ${userId} not found`);
          throw new HttpException(`User with ID ${userId} not found`, 404);
        }
      
        // Verwijder het recept uit de favorieten als het bestaat
        const index = user.favorites.indexOf(recipeId);
        if (index > -1) {
          user.favorites.splice(index, 1);
          await user.save(); // Sla de wijziging op in de database
          this.logger.log(`Recipe ${recipeId} removed from favorites`);
        } else {
          this.logger.log(`Recipe ${recipeId} not found in favorites`);
        }
      
        return user;
      }
      
      
    
    
    
}
