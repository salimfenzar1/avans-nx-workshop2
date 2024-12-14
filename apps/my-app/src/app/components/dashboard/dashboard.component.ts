import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Neo4jRecipeService } from '@avans-nx-workshop/features';
import { RecipeService, KookclubService } from '@avans-nx-workshop/features';
import { IKookclub, IRecipe, RecipeListResponse } from '@avans-nx-workshop/shared/api';
import { AuthService } from '@avans-nx-workshop/features';

@Component({
  selector: 'avans-nx-workshop-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  featuredRecipes: IRecipe[] = [];
  favoriteRecipes: any[] = [];
  bestRatedRecipes: any[] = [];
  isLoggedIn: boolean = false;
  kookclubs: IKookclub[] = [];

  constructor(
    private recipeService: RecipeService,
    private neo4jRecipeService: Neo4jRecipeService,
    private router: Router,
    private authService: AuthService,
    private kookclubService: KookclubService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getToken() !== null; // Controleer de inlogstatus
    if (this.isLoggedIn) {
      this.loadFeaturedRecipes();
      this.loadBestRatedRecipes();
      this.loadKookclubs();
    }
  }

  loadFeaturedRecipes(): void {
    this.recipeService.getRecipes().subscribe((data: RecipeListResponse) => {
      if (data && data.results && Array.isArray(data.results)) {
        this.featuredRecipes = data.results.slice(-3); // Laat alleen de laatste 6 recepten zien
      } else {
        console.error('Geen recepten gevonden of verkeerde structuur');
      }
    });
  }
  loadKookclubs(): void {
    this.kookclubService.getAllKookclubs().subscribe({
      next: (data) => {
        this.kookclubs = data.slice(-3);
      },
      error: (err) => {
        console.error('Fout bij het ophalen van kookclubs:', err);
      },
    });
  }

  
  loadBestRatedRecipes(): void {
    this.neo4jRecipeService.getBestRatedRecipes().subscribe({
      next: (data: RecipeListResponse) => {
        console.log('Data received for best-rated recipes:', data);
        if (data && data.results && Array.isArray(data.results)) {
          this.bestRatedRecipes = data.results.slice(-3); // Gebruik direct de resultaten
        } else {
          console.error('Incorrecte structuur voor best beoordeelde recepten.');
        }
      },
      error: (err) => {
        console.error('Fout bij ophalen best beoordeelde recepten:', err);
      },
    });
  }
  
  
  
  viewKookclub(id: string): void {
    this.router.navigate(['/kookclubs', id]);
  }
  viewRecipe(id: string): void {
    this.router.navigate(['/recipes', id]);
  }

  editRecipe(id: string): void {
    this.router.navigate(['/recipes', id, 'edit']);
  }
  getEigenaarNaam(eigenaar: string | { name: string; _id: string }): string {
    if (typeof eigenaar === 'object' && eigenaar.name) {
      return eigenaar.name; 
    }
    return typeof eigenaar === 'string' ? eigenaar : 'Onbekend'; 
  }
}
