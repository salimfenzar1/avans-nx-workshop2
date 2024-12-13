import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { RecipeService, UserService } from '@avans-nx-workshop/backend/user';

@Injectable()
export class RecipeNeo4jService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly mongoRecipeService: RecipeService,
    private readonly mongoUserService: UserService,
  ) {}

  // Synchroniseer recepten en favorieten naar Neo4j
  async syncRecipes(): Promise<void> {
    const recipes = await this.mongoRecipeService.findAll();
    const users = await this.mongoUserService.findAll(); 
  
    for (const recipe of recipes) {
      // Voeg recepten toe aan Neo4j
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
          imageUrl: recipe.imageUrl || 'default-image-url.jpg', // Voeg een standaardafbeelding toe als er geen is
          category: recipe.category,
          averageRating: recipe.averageRating || 0, // Standaard 0 als geen rating beschikbaar is
        }
      );
    }
  
    // Voeg favorieten relaties toe
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
  
  // Haal populairste recepten op
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

  // Haal best beoordeelde recepten op
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
