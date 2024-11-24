export interface IRecipe {
    _id?: string;
    title: string;
    description: string;
    ingredients: string[];
    steps: string[];
    cookingTime: number;
    imageUrl?: string;
  }
  export interface IRecipeResponse {
    results: IRecipe;
  }