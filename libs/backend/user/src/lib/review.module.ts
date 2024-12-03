import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from '../../../user/src/lib/review/review.schema';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';
import { UsersModule} from './users.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    UsersModule,

  ],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService], 
})
export class ReviewModule {}
