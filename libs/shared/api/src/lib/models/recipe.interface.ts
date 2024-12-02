export interface IRecipe {
    _id?: string;
    title: string;
    description: string;
    category: RecipeCategory;
    ingredients: string[];
    steps: string[];
    cookingTime: number;
    imageUrl?: string;
    userid?: string;
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
  