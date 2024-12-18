import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Review, ReviewDocument } from "./review.schema";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async addReview(userId: string, recipeId: string, rating: number, comment: string) {
    const review = new this.reviewModel({ user: userId, recipe: recipeId, rating, comment });
    return review.save();
  }

  async getReviewsForRecipe(recipeId: string) {
    return this.reviewModel
      .find({ recipe: recipeId })
      .populate('user', 'name')
      .exec();
  }

  async getAverageRating(recipeId: string) {
    const result = await this.reviewModel.aggregate([
        { $match: { recipe: new Types.ObjectId(recipeId) } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    return result.length > 0 ? result[0].averageRating : 0;
}
}
