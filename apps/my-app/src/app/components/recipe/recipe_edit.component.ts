import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@avans-nx-workshop/features';
import { Neo4jRecipeService } from '@avans-nx-workshop/features';
import { IRecipe } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe_edit.component.html',
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
      },
      error: (err) => {
        console.error('Fout bij ophalen recept:', err);
        this.errorMessage = 'Recept kon niet worden geladen.';
      },
    });
  }

  updateRecipe(): void {
    this.recipeService.updateRecipe(this.recipeId, this.recipe as IRecipe).subscribe({
      next: () => {
        this.syncRecipes(); // Call sync function after update
        this.successMessage = 'Recept succesvol bijgewerkt en gesynchroniseerd!';
        setTimeout(() => {
          this.router.navigate(['/recipes']);
        }, 2000); // Redirect after 2 seconds
      },
      error: (err) => {
        console.error('Fout bij bijwerken recept:', err);
        this.errorMessage = 'Recept kon niet worden bijgewerkt.';
      },
    });
  }

  syncRecipes(): void {
    this.neo4jRecipeService.syncRecipes().subscribe({
      next: (response) => {
        console.log('Synchronisatie succesvol:', response);
      },
      error: (err) => {
        console.error('Fout tijdens synchronisatie:', err);
      },
    });
  }
}
