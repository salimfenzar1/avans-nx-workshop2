import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { IUserInfo, IUser } from '@avans-nx-workshop/shared/api';
import { CreateUserDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';
import { UserExistGuard } from './user-exists.guard';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Vind alle gebruikers' })
    @Get()
    async findAll(): Promise<IUserInfo[]> {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: 'Vind een specifieke gebruiker' })
    @ApiParam({ name: 'id', description: 'De ID van de gebruiker' })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<IUser | null> {
        return this.userService.findOne(id);
    }

    @ApiOperation({ summary: 'Maak een nieuwe gebruiker' })
    @ApiBody({ type: CreateUserDto })
    @Post('')
    @UseGuards(UserExistGuard)
    create(@Body() user: CreateUserDto): Promise<IUserInfo> {
        return this.userService.create(user);
    }

    @ApiOperation({ summary: 'Werk een bestaande gebruiker bij' })
    @ApiParam({ name: 'id', description: 'De ID van de gebruiker' })
    @ApiBody({ type: UpdateUserDto })
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() user: UpdateUserDto
    ): Promise<IUserInfo | null> {
        return this.userService.update(id, user);
    }

    @ApiOperation({ summary: 'Voeg een favoriet recept toe voor een gebruiker' })
    @ApiParam({ name: 'id', description: 'De ID van de gebruiker' })
    @ApiParam({ name: 'recipeId', description: 'De ID van het recept' })
    @Post(':id/favorite/:recipeId')
    async addFavorite(
        @Param('id') userId: string,
        @Param('recipeId') recipeId: string
    ): Promise<IUserInfo | null> {
        return this.userService.addFavorite(userId, recipeId);
    }

    @ApiOperation({ summary: 'Haal alle favoriete recepten van een gebruiker op' })
    @ApiParam({ name: 'id', description: 'De ID van de gebruiker' })
    @Get(':id/favorites')
    async getFavorites(@Param('id') userId: string): Promise<IUserInfo | null> {
        return this.userService.getFavorites(userId);
    }

    @ApiOperation({ summary: 'Verwijder een favoriet recept van een gebruiker' })
    @ApiParam({ name: 'id', description: 'De ID van de gebruiker' })
    @ApiParam({ name: 'recipeId', description: 'De ID van het recept' })
    @Delete(':id/favorite/:recipeId')
    async removeFavorite(
        @Param('id') userId: string,
        @Param('recipeId') recipeId: string
    ): Promise<IUserInfo | null> {
        return this.userService.removeFavorite(userId, recipeId);
    }

    @ApiOperation({ summary: 'Haal het profiel van een gebruiker op' })
    @ApiParam({ name: 'id', description: 'De ID van de gebruiker' })
    @Get('profile/:id')
    async getProfile(@Param('id') userId: string): Promise<IUserInfo | null> {
        return this.userService.findOne(userId);
    }
}
