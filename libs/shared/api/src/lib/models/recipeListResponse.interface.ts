import { IRecipe } from "./recipe.interface";

export interface RecipeListResponse {
    results: IRecipe[];  // Array van recepten
    info: any;  // Voeg hier de extra info toe als nodig
  }
  