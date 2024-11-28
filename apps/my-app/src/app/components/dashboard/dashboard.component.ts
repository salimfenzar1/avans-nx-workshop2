import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '@avans-nx-workshop/features';
import { IRecipe, RecipeListResponse } from '@avans-nx-workshop/shared/api';
import { AuthService } from '@avans-nx-workshop/features';

@Component({
  selector: 'avans-nx-workshop-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  recipes: IRecipe[] = [];
  isLoggedIn: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getToken() !== null; // Controleer de inlogstatus
    if (this.isLoggedIn) {
      this.loadRecipes();
    }
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe((data: RecipeListResponse) => {
      if (data && data.results && Array.isArray(data.results)) {
        this.recipes = data.results.slice(-6); // Laat alleen de laatste 6 recepten zien
      } else {
        console.error('Geen recepten gevonden of verkeerde structuur');
      }
    });
  }

  viewRecipe(id: string): void {
    this.router.navigate(['/recipes', id]);
  }

  editRecipe(id: string): void {
    this.router.navigate(['/recipes', id, 'edit']);
  }
}
