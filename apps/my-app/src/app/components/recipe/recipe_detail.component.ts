import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@avans-nx-workshop/features';  // Zorg ervoor dat de service goed is geïmporteerd
import { IRecipe } from '@avans-nx-workshop/shared/api';
import { AuthService } from '@avans-nx-workshop/features'; 

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe_detail.component.html',
  styleUrls: []
})
export class RecipeDetailComponent implements OnInit {
  recipe: IRecipe | null = null;
  errorMessage: string | null = null;
  isOwner: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private authService: AuthService ,
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
          this.checkOwnership();
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

  editRecipe(): void {
    // Navigeer naar de edit-pagina voor dit recept
    if (this.recipe?._id) {
      this.router.navigate([`/recipes/edit/${this.recipe._id}`]);
    } else {
      this.errorMessage = 'Recipe ID is missing for editing.';
    }
  }

  checkOwnership(): void {
    const loggedInUserId = this.authService.getLoggedInUserId();
    if (this.recipe && loggedInUserId) {
      this.isOwner = this.recipe.userid === loggedInUserId; 
    }
  }

  deleteRecipe(): void {
    if (this.recipe?._id) {
      const confirmed = confirm('Weet je zeker dat je dit recept wilt verwijderen?');
      if (confirmed) {
        this.recipeService.deleteRecipe(this.recipe._id).subscribe({
          next: () => {
            alert('Recept succesvol verwijderd!');
            this.router.navigate(['/recipes']); // Navigeer terug naar de receptenlijst
          },
          error: (err) => {
            console.error('Error deleting recipe:', err);
            alert('Fout bij het verwijderen van het recept.');
          },
        });
      }
    } else {
      this.errorMessage = 'Recipe ID is missing for deletion.';
    }
  }
}

  
  

