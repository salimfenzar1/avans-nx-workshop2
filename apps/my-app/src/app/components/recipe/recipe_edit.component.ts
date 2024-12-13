import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@avans-nx-workshop/features';
import { Neo4jRecipeService } from '@avans-nx-workshop/features';
import { IRecipe } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe_edit.component.html',
  styleUrls: [],
})
export class RecipeEditComponent implements OnInit {
  recipe: Partial<IRecipe> = {
    title: '',
    description: '',
    ingredients: [],
    steps: [],
    cookingTime: 0,
    imageUrl: '',
  };
  recipeId: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private neo4jRecipeService: Neo4jRecipeService, // Inject Neo4j service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id')!;
    this.loadRecipe();
  }

  loadRecipe(): void {
    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (response) => {
        this.recipe = response.results;
        if (!this.recipe.ingredients) this.recipe.ingredients = [];
        if (!this.recipe.steps) this.recipe.steps = [];
      },
      error: (err) => {
        console.error('Error loading recipe:', err);
        this.errorMessage = 'Failed to load the recipe.';
      },
    });
  }

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

  updateRecipe(form: NgForm): void {
    if (form.invalid ||!this.recipe.title || !this.recipe.description || !this.recipe.cookingTime || !this.recipe.category) {
      this.errorMessage = 'Please ensure all required fields are filled.';
      return;
    }
  
    const formattedIngredients = (this.recipe.ingredients || []).map((ingredient) => ({
      name: ingredient.name || '',
      amount: ingredient.amount || '',
    }));
  
    const formattedSteps = (this.recipe.steps || []).map((step) => ({
      instruction: step.instruction || '',
    }));
  
    const updatedRecipe: IRecipe = {
      ...this.recipe,
      title: this.recipe.title!, // Force non-undefined value
      description: this.recipe.description!,
      cookingTime: this.recipe.cookingTime!,
      category: this.recipe.category!, // Force non-undefined value for category
      ingredients: formattedIngredients,
      steps: formattedSteps,
      imageUrl: this.recipe.imageUrl || '', // Optional field
    };
  
    this.recipeService.updateRecipe(this.recipeId, updatedRecipe).subscribe({
      next: () => {
        this.syncRecipes(); // Call sync function
        this.successMessage = 'Recipe successfully updated and synchronized!';
        setTimeout(() => {
          this.router.navigate([`/recipes`]);
        }, 2000); // Redirect after 2 seconds
      },
      error: (err) => {
        console.error('Error updating recipe:', err);
        this.errorMessage = 'Failed to update the recipe.';
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
