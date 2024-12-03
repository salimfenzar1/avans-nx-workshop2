import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUserInfo, IUser } from '@avans-nx-workshop/shared/api';
import { CreateUserDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';
import { UserExistGuard } from './user-exists.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<IUserInfo[]> {
        return this.userService.findAll();
    }

    // this method should precede the general getOne method, otherwise it never matches
    // @Get('self')
    // async getSelf(@InjectToken() token: Token): Promise<IUser> {
    //     const result = await this.userService.getOne(token.id);
    //     return result;
    // }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<IUser | null> {
        return this.userService.findOne(id);
    }

    @Post('')
    @UseGuards(UserExistGuard)
    create(@Body() user: CreateUserDto): Promise<IUserInfo> {
        return this.userService.create(user);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() user: UpdateUserDto
    ): Promise<IUserInfo | null> {
        return this.userService.update(id, user);
    }

    @Post(':id/favorite/:recipeId')
    async addFavorite(
        @Param('id') userId: string,
        @Param('recipeId') recipeId: string
    ): Promise<IUserInfo | null> {
        return this.userService.addFavorite(userId, recipeId);
    }
      @Get(':id/favorites')
      async getFavorites(@Param('id') userId: string): Promise<IUserInfo | null> {
        return this.userService.getFavorites(userId);
      }
      
      @Delete(':id/favorite/:recipeId')
      async removeFavorite(
        @Param('id') userId: string,
        @Param('recipeId') recipeId: string
      ): Promise<IUserInfo | null> {
        return this.userService.removeFavorite(userId, recipeId);
      }
      
      @Get('profile/:id')
async getProfile(@Param('id') userId: string): Promise<IUserInfo | null> {
    return this.userService.findOne(userId);
}

    }
