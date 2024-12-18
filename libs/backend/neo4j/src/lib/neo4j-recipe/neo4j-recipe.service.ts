import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { RecipeService, UserService } from '@avans-nx-workshop/backend/user';
import { ReviewService } from 'libs/backend/user/src/lib/review/review.service';

@Injectable()
export class RecipeNeo4jService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly mongoRecipeService: RecipeService,
    private readonly mongoUserService: UserService,
    private readonly mongoReviewService: ReviewService
  ) {}

  async syncRecipes(): Promise<void> {
    const recipes = await this.mongoRecipeService.findAll();
    const users = await this.mongoUserService.findAll(); 
  
    for (const recipe of recipes) {
      await this.neo4jService.write(
        `
        MERGE (r:Recipe {id: $recipeId})
        SET r.title = $title, 
            r.description = $description, 
            r.imageUrl = $imageUrl, 
            r.category = $category, 
            r.averageRating = $averageRating
        `,
        {
          recipeId: recipe._id.toString(),
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.imageUrl || 'default-image-url.jpg', 
          category: recipe.category,
          averageRating: recipe.averageRating || 0, 
        }
      );
      const reviews = await this.mongoReviewService.getReviewsForRecipe(recipe._id.toString());
      for (const review of reviews) {
        await this.neo4jService.write(
          `
          MATCH (r:Recipe {id: $recipeId})
          MERGE (u:User {id: $userId})
          MERGE (u)-[rev:REVIEWED]->(r)
          SET rev.rating = $rating, 
              rev.comment = $comment
          `,
          {
            recipeId: recipe._id.toString(),
            userId: review.user.toString(),
            rating: review.rating,
            comment: review.comment || '',
          }
        );
      }
    }

    for (const user of users) {
      if (user.favorites && Array.isArray(user.favorites)) {
        for (const recipeId of user.favorites) {
          await this.neo4jService.write(
            `
            MATCH (r:Recipe {id: $recipeId})
            MERGE (u:User {id: $userId})
            MERGE (u)-[:FAVORITES]->(r)
            `,
            {
              recipeId: recipeId.toString(),
              userId: user._id.toString(),
            }
          );
        }
      }
    }
  }

  async deleteRecipeFromNeo4j(recipeId: string): Promise<void> {
    await this.neo4jService.write(
      `
      MATCH (r:Recipe {id: $recipeId})
      DETACH DELETE r
      `,
      { recipeId }
    );
  }

  async getPopularRecipes(): Promise<any[]> {
    const query = `
      MATCH (r:Recipe)<-[:FAVORITES]-(u:User)
      RETURN r, COUNT(u) AS favorites
      ORDER BY favorites DESC
      LIMIT 10
    `;
    const result = await this.neo4jService.read(query);

    return result.records.map((record) => ({
      recipe: record.get('r').properties,
      favorites: record.get('favorites').toInt(),
    }));
  }

  async getBestRatedRecipes(): Promise<any[]> {
    const query = `
      MATCH (r:Recipe)
      WHERE r.averageRating IS NOT NULL
      RETURN r
      ORDER BY r.averageRating DESC
      LIMIT 10
    `;
    const result = await this.neo4jService.read(query);

    return result.records.map((record) => ({
      recipe: record.get('r').properties,
    }));
  }
  
}
