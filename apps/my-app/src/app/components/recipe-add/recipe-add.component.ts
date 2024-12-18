import { Component } from '@angular/core';
import { RecipeService } from '@avans-nx-workshop/features';
import { Neo4jRecipeService } from '@avans-nx-workshop/features';
import { IRecipe, RecipeCategory } from '@avans-nx-workshop/shared/api';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: [],
})
export class RecipeAddComponent {
  recipe: Partial<IRecipe> = {
    title: '',
    description: '',
    category: undefined,
    ingredients: [], 
    steps: [], 
    cookingTime: 0,
    imageUrl: ''
  };

  categories: string[] = Object.values(RecipeCategory);
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private recipeService: RecipeService,
    private neo4jRecipeService: Neo4jRecipeService,
    private router: Router
  ) {}

  addIngredient(): void {
    if (!this.recipe.ingredients) {
      this.recipe.ingredients = []; 
    }
    this.recipe.ingredients.push({ name: '', amount: '' });
  }

  removeIngredient(index: number): void {
    if (this.recipe.ingredients) {
      this.recipe.ingredients.splice(index, 1);
    }
  }

  addStep(): void {
    if (!this.recipe.steps) {
      this.recipe.steps = [];
    }
    this.recipe.steps.push({ instruction: '' });
  }

  removeStep(index: number): void {
    if (this.recipe.steps) {
      this.recipe.steps.splice(index, 1);
    }
  }

  addRecipe(form: NgForm): void {
    if (form.invalid || !this.recipe.title || !this.recipe.description || !this.recipe.cookingTime) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const formattedIngredients = (this.recipe.ingredients || []).map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.amount,
    }));

    const formattedSteps = (this.recipe.steps || []).map((step) => ({
      instruction: step.instruction,
    }));

    const formattedRecipe: IRecipe = {
      ...this.recipe,
      ingredients: formattedIngredients,
      steps: formattedSteps,
      cookingTime: this.recipe.cookingTime!,
      category: this.recipe.category!,
      title: this.recipe.title!,
      description: this.recipe.description!,
      imageUrl: this.recipe.imageUrl,
    };

    console.log('Recipe data to send:', formattedRecipe);

    this.recipeService.createRecipe(formattedRecipe).subscribe({
      next: (response) => {
        console.log('Recipe added successfully:', response);
        this.syncRecipes();
        this.successMessage = 'Recipe added and synchronized successfully!';
        setTimeout(() => {
          this.router.navigate(['/recipes']);
        }, 2000); 
      },
      error: (err) => {
        console.error('Error adding recipe:', err);
        this.errorMessage = 'Failed to add recipe. Please try again.';
      },
    });
  }

  syncRecipes(): void {
    this.neo4jRecipeService.syncRecipes().subscribe({
      next: (response) => {
        console.log('Synchronization successful:', response);
      },
      error: (err) => {
        console.error('Error during synchronization:', err);
      },
    });
  }
}
