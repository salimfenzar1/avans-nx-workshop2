import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards, Request, Put } from '@nestjs/common';
import { KookclubService } from './kookClub.service';
import { Kookclub } from './kookClub.schema';
import { AuthGuard } from '@avans-nx-workshop/backend/auth';

@Controller('kookclubs')
export class KookclubController {
  constructor(private readonly kookclubService: KookclubService) {}

  @Post()
  @UseGuards(AuthGuard) 
  async createKookclub(
    @Body() data: Partial<Kookclub>,
    @Request() req: any
  ): Promise<Kookclub> {
    const userId = req.user.user_id;
    return this.kookclubService.createKookclub(data, userId);
  }

  @Get()
  async findAll(): Promise<Kookclub[]> {
    return this.kookclubService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Kookclub> {
    return this.kookclubService.findById(id);
  }

  @Put(':id/join')
  @UseGuards(AuthGuard) 
  async joinKookclub(@Param('id') id: string, @Request() req: any): Promise<Kookclub> {
    const userId = req.user.user_id;
    return this.kookclubService.joinKookclub(id, userId);
  }

  @Put(':id/leave')
  @UseGuards(AuthGuard) 
  async leaveKookclub(@Param('id') id: string, @Request() req: any): Promise<Kookclub> {
    const userId = req.user.user_id;
    return this.kookclubService.leaveKookclub(id, userId);
  }

  @Put(':id/recipes')
  @UseGuards(AuthGuard) 
  async addRecipeToKookclub(
    @Param('id') id: string,
    @Body('recipeId') recipeId: string
  ): Promise<Kookclub> {
    return this.kookclubService.addRecipeToKookclub(id, recipeId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard) 
  async deleteKookclub(@Param('id') id: string, @Request() req: any): Promise<void> {
    const userId = req.user.user_id;
    return this.kookclubService.deleteKookclub(id, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateKookclub(
    @Param('id') id: string,
    @Body() data: Partial<Kookclub>,
    @Request() req: any
  ): Promise<Kookclub> {
    const userId = req.user.user_id;
    return this.kookclubService.updateKookclub(id, userId, data);
  }

}
