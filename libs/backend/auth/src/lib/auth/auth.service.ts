import { Injectable, Logger } from '@nestjs/common';
import {
    ConflictException,
    UnauthorizedException
} from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import {
    User as UserModel,
    UserDocument
} from '@avans-nx-workshop/backend/user';
import { JwtService } from '@nestjs/jwt';
import { IUserCredentials, IUserIdentity } from '@avans-nx-workshop/shared/api';
import { CreateUserDto } from '@avans-nx-workshop/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'; // bcrypt toegevoegd

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly saltRounds = 10; 

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {}

    async validateUser(credentials: IUserCredentials): Promise<any> {
        this.logger.log('validateUser');
        const user = await this.userModel.findOne({
            emailAddress: credentials.emailAddress
        }).select('+password'); // Zorg ervoor dat het wachtwoord wordt opgehaald

        if (user && await bcrypt.compare(credentials.password, user.password)) { // Vergelijk gehashte wachtwoorden
            return user;
        }

        return null;
    }

    async login(credentials: IUserCredentials): Promise<IUserIdentity> {
        this.logger.log('login ' + credentials.emailAddress);
        return await this.userModel
            .findOne({
                emailAddress: credentials.emailAddress
            })
            .select('+password') // Haal het wachtwoord op voor vergelijking
            .exec()
            .then(async (user) => {
                if (user && await bcrypt.compare(credentials.password, user.password)) { // Vergelijk gehashte wachtwoorden
                    const payload = {
                        user_id: user._id,
                        name: user.name,
                        profileImgUrl: user.profileImgUrl || ''
                    };
                    return {
                        _id: user._id,
                        name: user.name,
                        emailAddress: user.emailAddress,
                        profileImgUrl: user.profileImgUrl,
                        token: this.jwtService.sign(payload)
                    };
                } else {
                    const errMsg = 'Email not found or password invalid';
                    this.logger.debug(errMsg);
                    throw new UnauthorizedException(errMsg);
                }
            })
            .catch((error) => {
                return error;
            });
    }

    async register(user: CreateUserDto): Promise<IUserIdentity> {
        this.logger.log(`Registering user: ${user.name}`);
    
        // Check if the user already exists
        const existingUser = await this.userModel.findOne({ emailAddress: user.emailAddress });
        if (existingUser) {
            this.logger.debug('User already exists');
            throw new ConflictException('User already exists');
        }
    
        // Hash het wachtwoord
        const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);
        user.password = hashedPassword; // Sla het gehashte wachtwoord op
    
        // Create the user in the database
        this.logger.debug('User not found, creating new user');
        const createdUser = await this.userModel.create(user);
    
        // Generate a JWT token for the user
        const payload = { user_id: createdUser._id.toString(), name: createdUser.name, profileImgUrl: createdUser.profileImgUrl };
        const token = this.jwtService.sign(payload);
    
        // Return the created user with the token
        return {
            name: createdUser.name,
            emailAddress: createdUser.emailAddress,
            profileImgUrl: createdUser.profileImgUrl,
            role: createdUser.role,
            token: token
        };
    }
}
