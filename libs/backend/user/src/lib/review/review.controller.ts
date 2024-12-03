import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { ReviewService } from "./review.service";

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async addReview(
    @Body() body: { userId: string; recipeId: string; rating: number; comment: string },
  ) {
    return this.reviewService.addReview(body.userId, body.recipeId, body.rating, body.comment);
  }

  @Get(':recipeId')
  async getReviews(@Param('recipeId') recipeId: string) {
    const reviews = await this.reviewService.getReviewsForRecipe(recipeId);
    const averageRating = await this.reviewService.getAverageRating(recipeId);

    return {
      reviews,
      averageRating,
    };
  }
}
