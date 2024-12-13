import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Neo4jRecipeService, RecipeService } from '@avans-nx-workshop/features';  // Zorg ervoor dat de service goed is geïmporteerd
import { IRecipe, IReviewResponse } from '@avans-nx-workshop/shared/api';
import { AuthService } from '@avans-nx-workshop/features'; 
import { ReviewService } from '@avans-nx-workshop/features'; 

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe_detail.component.html',
  styleUrls: []
})
export class RecipeDetailComponent implements OnInit {
  recipe: IRecipe | null = null;
  errorMessage: string | null = null;
  isOwner: boolean = false; 
  isFavorite: boolean = false;
  reviews: any[] = [];

  newReview = { rating: null, comment: '' };
  averageRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private authService: AuthService ,
    private recipeService: RecipeService,
    private reviewService: ReviewService,
    private neo4jRecipeService: Neo4jRecipeService
  ) {}

  ngOnInit(): void {
    // Haal het ID op uit de URL-parameter
    const recipeId = this.route.snapshot.paramMap.get('id')!;
    if (recipeId) {
      this.getRecipeDetail(recipeId);
      this.loadReviews(recipeId);
    } else {
      this.errorMessage = 'Recipe ID is missing';
    }
  }

  getRecipeDetail(id: string): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        if (data && data.results) {
          this.recipe = data.results; // Recept instellen
          this.checkOwnership(); // Controleer eigendom
          this.checkIfFavorite(id); // Controleer of het een favoriet is
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

  checkIfFavorite(recipeId: string): void {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;
  
    this.recipeService.getFavorites(userId).subscribe({
      next: (favoritesResponse) => {
        if (favoritesResponse && favoritesResponse.results) {
          this.isFavorite = favoritesResponse.results.some(
            (recipe) => recipe._id === recipeId
          );
          console.log(`Is recipe ${recipeId} a favorite?`, this.isFavorite);
        } else {
          console.error('Favorites response heeft geen correcte structuur:', favoritesResponse);
        }
      },
      error: (err) => {
        console.error('Error checking favorites:', err);
      },
    });
  }
  
  

  toggleFavorite(): void {
    const userId = this.authService.getLoggedInUserId();
    if (!userId || !this.recipe?._id) return;
  
    if (this.isFavorite) {
      // Verwijder uit favorieten
      this.recipeService.removeFavorite(userId, this.recipe._id).subscribe({
        next: () => {
          this.isFavorite = false;
          console.log(`Recipe ${this.recipe?._id} removed from favorites`);
          this.updateFavoritesList(); // Update favorietenlijst
        },
        error: (err) => {
          console.error('Error removing favorite:', err);
        },
      });
    } else {
      // Voeg toe aan favorieten
      this.recipeService.addFavorite(userId, this.recipe._id).subscribe({
        next: () => {
          this.isFavorite = true;
          console.log(`Recipe ${this.recipe?._id} added to favorites`);
          this.updateFavoritesList(); // Update favorietenlijst
        },
        error: (err) => {
          console.error('Error adding favorite:', err);
        },
      });
    }
  }
  
  updateFavoritesList(): void {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;
  
    this.recipeService.getFavorites(userId).subscribe({
      next: (favoritesResponse) => {
        if (favoritesResponse && favoritesResponse.results) {
          console.log('Updated favorites:', favoritesResponse.results);
        } else {
          console.error('Favorites response heeft geen correcte structuur:', favoritesResponse);
        }
      },
      error: (err) => {
        console.error('Error refreshing favorites list:', err);
      },
    });
  }

  addReview(): void {
    const userId = this.authService.getLoggedInUserId();
    if (!userId || !this.recipe?._id) {
      console.error('User ID or Recipe ID is missing.');
      return;
    }
  
    if (this.newReview.rating === null || this.newReview.rating < 1 || this.newReview.rating > 5) {
      console.error('Invalid rating provided');
      return;
    }
  
    this.reviewService
      .addReview(userId, this.recipe._id, this.newReview.rating, this.newReview.comment)
      .subscribe({
        next: () => {
          alert('Added review!');
          if (this.recipe && this.recipe._id) {
            this.loadReviews(this.recipe._id); 
          }
          this.newReview = { rating: null, comment: '' };
        },
        error: (err) => {
          console.error('Error adding review:', err);
        },
      });
  }
  
  
  
  loadReviews(recipeId: string): void {
    this.reviewService.getReviews(recipeId).subscribe({
      next: (data: IReviewResponse) => {
        // Zorg dat je toegang hebt tot het `results` object
        const results = data?.results;
        if (results) {
          this.reviews = results.reviews || []; // Haal reviews uit results
          this.averageRating = results.averageRating || 0; // Haal gemiddelde beoordeling uit results
        } else {
          this.reviews = []; // Als results ontbreekt, zet een lege array
          this.averageRating = 0;
        }
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      },
    });
  }
  


 addToFavorites(): void {
    const userId = this.authService.getLoggedInUserId(); // Zorg dat je deze methode hebt
    if (!this.recipe?._id || !userId) {
        this.errorMessage = 'Recipe ID or User ID is missing.';
        return;
    }

    this.recipeService.addFavorite(userId, this.recipe._id).subscribe({
        next: () => {
            alert('Recipe has been added to your favorites!');
        },
        error: (err) => {
            console.error('Error adding recipe to favorites:', err);
            this.errorMessage = 'Failed to add recipe to favorites. Please try again.';
        },
    });
}


  deleteRecipe(): void {
    if (this.recipe?._id) {
      const confirmed = confirm('Weet je zeker dat je dit recept wilt verwijderen?');
      if (confirmed) {
        this.recipeService.deleteRecipe(this.recipe._id).subscribe({
          next: () => {
            this.syncRecipes();
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

  
  

