import { Component, OnInit } from '@angular/core';
import { KookclubService } from '@avans-nx-workshop/features';
import { IKookclub, IRecipe } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-create-kookclub',
  templateUrl: './create-kookclub.component.html',
  styleUrls: [],
})
export class CreateKookclubComponent implements OnInit {
  kookclubNaam = '';
  beschrijving = '';
  categorieen: string[] = [];
  availableRecipes: IRecipe[] = [];
  selectedRecepten: string[] = [];

  constructor(private kookclubService: KookclubService) {}

  ngOnInit(): void {
    this.loadAvailableRecipes();
  }

  loadAvailableRecipes(): void {
    this.kookclubService.getAvailableRecipes().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          // Als data een array is
          this.availableRecipes = data.flatMap((item) => item.results || []);
        } else {
          // Als data een enkel object is
          this.availableRecipes = data.results || [];
        }
        console.log('Beschikbare recepten:', this.availableRecipes);
      },
      error: (err) => {
        console.error('Error bij het laden van recepten:', err);
      },
    });
  }
  

  addCategorie(categorie: string): void {
    if (categorie && !this.categorieen.includes(categorie)) {
      this.categorieen.push(categorie);
    }
  }

  removeCategorie(index: number): void {
    this.categorieen.splice(index, 1);
  }

  toggleRecipeSelection(recipeId: string): void {
    const index = this.selectedRecepten.indexOf(recipeId);
    if (index === -1) {
      this.selectedRecepten.push(recipeId);
    } else {
      this.selectedRecepten.splice(index, 1);
    }
  }

  createKookclub(): void {
    const selectedRecipeObjects = this.availableRecipes
      .filter(
        (recipe) =>
          recipe._id !== undefined && this.selectedRecepten.includes(recipe._id)
      )
      .map((recipe) => ({
        _id: recipe._id as string, // Forceer naar string (na filter is _id gegarandeerd een string)
        title: recipe.title,
        description: recipe.description,
      })); // Map naar het verwachte formaat
  
    const newKookclub: Partial<IKookclub> = {
      naam: this.kookclubNaam,
      beschrijving: this.beschrijving,
      categorieen: this.categorieen,
      recepten: selectedRecipeObjects, // Objecten met het juiste type
    };
  
    this.kookclubService.createKookclub(newKookclub).subscribe({
      next: () => {
        alert('Kookclub aangemaakt!');
      },
      error: (err) => {
        console.error('Error bij het aanmaken van de kookclub:', err);
      },
    });
  }
  
  
  
}
