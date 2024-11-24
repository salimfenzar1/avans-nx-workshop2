import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '@avans-nx-workshop/features';  // Zorg ervoor dat de service goed is geïmporteerd
import { IRecipe } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe_detail.component.html',
  styleUrls: []
})
export class RecipeDetailComponent implements OnInit {
  recipe: IRecipe | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    // Haal het ID op uit de URL-parameter
    const recipeId = this.route.snapshot.paramMap.get('id')!;
    if (recipeId) {
      this.getRecipeDetail(recipeId);
    } else {
      this.errorMessage = 'Recipe ID is missing';
    }
  }

  getRecipeDetail(id: string): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        // Controleer of 'results' bestaat en zet het in de 'recipe' variabele
        if (data && data.results) {
          this.recipe = data.results; // Zorg ervoor dat de juiste data wordt toegewezen
        } else {
          this.errorMessage = 'Recipe not found';
        }
      },
      error: (err) => {
        console.error('Error fetching recipe details:', err);
        this.errorMessage = 'Failed to fetch recipe details. Please try again.';
      },
    });
  }
  
}
