import { IReview } from "./review.interface";

export interface IReviewResponse {
  results: {
    reviews: IReview[];
    averageRating: number;
  };
}