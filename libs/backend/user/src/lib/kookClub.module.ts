import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KookclubController } from './kookClub/kookClub.controller';
import { KookclubService } from './kookClub/kookClub.service';
import { Kookclub, KookclubSchema } from './kookClub/kookClub.schema';
import { AuthModule } from '@avans-nx-workshop/backend/auth';

@Module({
  imports: [MongooseModule.forFeature([{ name: Kookclub.name, schema: KookclubSchema }]),
AuthModule],
  controllers: [KookclubController],
  providers: [KookclubService],
  exports:[KookclubService]
})
export class KookclubModule {}
