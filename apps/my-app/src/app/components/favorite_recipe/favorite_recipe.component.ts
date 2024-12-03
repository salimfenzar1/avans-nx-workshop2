import { Component, OnInit } from '@angular/core';
import { RecipeService } from '@avans-nx-workshop/features';
import { IRecipe, RecipeCategory, RecipeListResponse } from '@avans-nx-workshop/shared/api';
import { AuthService } from '@avans-nx-workshop/features';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorite_recipe.component.html',
  styleUrls: [],
})
export class FavoritesComponent implements OnInit {
  favoriteRecipes: IRecipe[] = [];
  filteredRecipes: IRecipe[] = [];
  selectedTimeFilter: string = '';
  selectedCategory: RecipeCategory | '' = '';
  searchQuery: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;
  categories: RecipeCategory[] = Object.values(RecipeCategory);

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    const userId = this.authService.getLoggedInUserId();
  
    if (userId) {
      this.recipeService.getFavorites(userId).subscribe({
        next: (data: RecipeListResponse) => {
          if (data && Array.isArray(data.results)) {
            this.favoriteRecipes = data.results; // Correct toewijzen
            this.filteredRecipes = [...this.favoriteRecipes];
          } else {
            console.error('Unexpected response structure:', data);
            this.errorMessage = 'Unexpected response structure from server.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching favorites:', err);
          this.errorMessage = 'Failed to load favorite recipes.';
          this.isLoading = false;
        },
      });
    } else {
      this.errorMessage = 'User not logged in.';
      this.isLoading = false;
    }
  }
  
  
  
  filterFavorites(): void {
    this.filteredRecipes = this.favoriteRecipes.filter((recipe) => {
        const matchesSearchQuery =
          recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(this.searchQuery.toLowerCase());
  
        const matchesTimeFilter =
          !this.selectedTimeFilter ||
          (this.selectedTimeFilter === '30' && recipe.cookingTime <= 30) ||
          (this.selectedTimeFilter === '60' && recipe.cookingTime <= 60) ||
          (this.selectedTimeFilter === '120' && recipe.cookingTime <= 120);
  
          const matchesCategory =
          !this.selectedCategory || recipe.category === this.selectedCategory;
  
        return matchesSearchQuery && matchesTimeFilter && matchesCategory;
      });
    }
}
