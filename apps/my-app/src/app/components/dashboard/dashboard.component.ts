import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '@avans-nx-workshop/features'; // Zorg ervoor dat je RecipeService importeert
import { IRecipe, RecipeListResponse } from '@avans-nx-workshop/shared/api'; 

@Component({
    selector: 'avans-nx-workshop-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    recipes: IRecipe[] = [];

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe((data: RecipeListResponse) => {
      console.log('Fetched recipes:', data);
      if (data && data.results && Array.isArray(data.results)) {
        this.recipes = data.results;  // We gebruiken de array binnen 'results'
      } else {
        console.error('Geen recepten gevonden of verkeerde structuur');
      }
    });
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Controleer of een token in localStorage is opgeslagen
  }
    viewRecipe(id: string): void {
      this.router.navigate(['/recipes', id]);
    }
  
    editRecipe(id: string): void {
      this.router.navigate(['/recipes', id, 'edit']);
    }
  
    isAdmin(): boolean {
      // Replace with your actual admin check logic
      return localStorage.getItem('role') === 'Admin';
    }
  }