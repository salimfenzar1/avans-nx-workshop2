import { Component } from '@angular/core';
import { RecipeService } from '@avans-nx-workshop/features';
import { IRecipe } from '@avans-nx-workshop/shared/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: [],
})
export class RecipeAddComponent {
  recipe: Partial<IRecipe> = {
    title: '',
    description: '',
    ingredients: [],
    steps: [],
    cookingTime: 0,
    imageUrl: ''
  };

  errorMessage: string | null = null;

  constructor(private recipeService: RecipeService, private router: Router) {}

  addRecipe(): void {
    console.log('Recipe data to send:', this.recipe);  // Controleer de gegevens
    this.recipeService.createRecipe(this.recipe as IRecipe).subscribe({
      next: (response) => {
        console.log('Recipe added successfully:', response);
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        console.error('Error adding recipe:', err);
        this.errorMessage = 'Failed to add recipe. Please try again.';
      },
    });
  }
  
}
