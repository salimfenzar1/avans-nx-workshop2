import { Injectable, Logger } from '@nestjs/common';
import {
    BadRequestException,
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
import * as bcrypt from 'bcrypt'; 

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
        }).select('+password');

        if (user && await bcrypt.compare(credentials.password, user.password)) { 
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
            .select('+password') 
            .exec()
            .then(async (user) => {
                if (user && await bcrypt.compare(credentials.password, user.password)) { 
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
    try{
        const existingUser = await this.userModel.findOne({ emailAddress: user.emailAddress });
        if (existingUser) {
            this.logger.debug('User already exists');
            throw new ConflictException('User already exists');
        }
        if (!user.emailAddress || !user.password) {
            throw new BadRequestException('Invalid data. Please check all fields.');
        }
    
        const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);
        user.password = hashedPassword;
    
        this.logger.debug('User not found, creating new user');
        const createdUser = await this.userModel.create(user);
    
        const payload = { user_id: createdUser._id.toString(), name: createdUser.name, profileImgUrl: createdUser.profileImgUrl };
        const token = this.jwtService.sign(payload);
    
        return {
            name: createdUser.name,
            emailAddress: createdUser.emailAddress,
            profileImgUrl: createdUser.profileImgUrl,
            role: createdUser.role,
            token: token
        };
    }catch (err) {
    if ((err as any).name === 'ValidationError') {
        this.logger.error('Validation error:', (err as any).errors);

        const errorDetails = Object.values((err as any).errors).map((error: any) => {
            return {
                field: error.path || 'unknown', 
                message: error.message || 'Unknown validation error',
            };
        });

        throw new BadRequestException({
            message: 'Validation failed',
            errors: errorDetails,
        });
    }
    throw err; 
}

}
}
