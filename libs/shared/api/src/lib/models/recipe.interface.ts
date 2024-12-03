export interface IRecipe {
  _id?: string;
  title: string;
  description: string;
  category: RecipeCategory;
  ingredients: { name: string; amount: string }[]; // Ingrediënten met naam en hoeveelheid
  steps: { instruction: string }[]; // Stappen met instructies
  cookingTime: number;
  imageUrl?: string;
  userid?: string;
  averageRating?: number;
}
  export interface IRecipeResponse {
    results: IRecipe;
  }

  export enum RecipeCategory {
    VEGETARIAN = 'Vegetarian',
    VEGAN = 'Vegan',
    DESSERT = 'Dessert',
    MAIN_COURSE = 'Main Course',
    APPETIZER = 'Appetizer',
    SNACK = 'Snack',
  }
  