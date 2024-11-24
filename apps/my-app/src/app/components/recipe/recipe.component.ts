import { Component, OnInit } from '@angular/core';
import { RecipeService } from '@avans-nx-workshop/features';
import { IRecipe, RecipeListResponse } from '@avans-nx-workshop/shared/api';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-recipes', 
  templateUrl: './recipe.component.html',
  styleUrls: [], 
})
export class RecipesComponent implements OnInit {
  recipes: IRecipe[] = [];
  filteredRecipes: IRecipe[] = [];
  searchQuery: string = '';
  selectedTimeFilter: string = '';

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe((data: RecipeListResponse) => {
      console.log('Fetched recipes:', data);
      if (data && data.results && Array.isArray(data.results)) {
        this.recipes = data.results;  // We gebruiken de array binnen 'results'
        this.filteredRecipes = [...this.recipes]; 
      } else {
        console.error('Geen recepten gevonden of verkeerde structuur');
      }
    });
  }
  filterRecipes(): void {
    this.filteredRecipes = this.recipes.filter((recipe) => {
      const matchesSearchQuery =
        recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesTimeFilter =
        !this.selectedTimeFilter ||
        (this.selectedTimeFilter === '30' && recipe.cookingTime <= 30) ||
        (this.selectedTimeFilter === '60' && recipe.cookingTime <= 60) ||
        (this.selectedTimeFilter === '120' && recipe.cookingTime <= 120);

      return matchesSearchQuery && matchesTimeFilter;
    });
  }
  
  
  addRecipe(): void {
    this.router.navigate(['/recipes/add']);
  }
}
