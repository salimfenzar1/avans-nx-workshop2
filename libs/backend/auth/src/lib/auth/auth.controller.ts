import {
    Controller,
    Post,
    Logger,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../decorators/decorators';
import {
    IUserCredentials,
    IUserIdentity,
} from '@avans-nx-workshop/shared/api';
import { CreateUserDto } from '@avans-nx-workshop/backend/dto';
import { UserExistGuard } from '@avans-nx-workshop/backend/user';

@ApiTags('Authentication') 
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Log in een gebruiker in' })
    @ApiBody({
        description: 'Gebruikersinloggegevens',
        type: Object,
        schema: {
            properties: {
                email: { type: 'string', example: 'test@example.com' },
                password: { type: 'string', example: 'password123' },
            },
        },
    })
    @Public()
    @Post('login')
    async login(@Body() credentials: IUserCredentials): Promise<IUserIdentity> {
        this.logger.log('Login');
        return await this.authService.login(credentials);
    }

    @ApiOperation({ summary: 'Registreer een nieuwe gebruiker' })
    @ApiBody({
        description: 'Gebruikersregistratiegegevens',
        type: CreateUserDto,
    })
    @Public()
    @Post('register')
    async register(@Body() user: CreateUserDto): Promise<IUserIdentity> {
        this.logger.log('Register');
        return await this.authService.register(user);
    }
}
