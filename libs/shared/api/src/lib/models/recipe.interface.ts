export interface IRecipe {
    _id?: string;
    title: string;
    description: string;
    ingredients: string[];
    steps: string[];
    cookingTime: number;
    imageUrl?: string;
    userid?: string;
  }
  export interface IRecipeResponse {
    results: IRecipe;
  }