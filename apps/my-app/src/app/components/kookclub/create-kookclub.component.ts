import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KookclubService } from '@avans-nx-workshop/features';
import { IKookclub, IRecipe, KookclubCategorie } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-create-kookclub',
  templateUrl: './create-kookclub.component.html',
  styleUrls: [],
})
export class CreateKookclubComponent implements OnInit {
  kookclubNaam = '';
  beschrijving = '';
  categorieen: KookclubCategorie[] = []; 
  availableCategories = Object.values(KookclubCategorie);
  availableRecipes: IRecipe[] = [];
  selectedRecepten: string[] = [];

  constructor(private kookclubService: KookclubService , private router: Router,) {}

  ngOnInit(): void {
    this.loadAvailableRecipes();
  }

  loadAvailableRecipes(): void {
    this.kookclubService.getAvailableRecipes().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.availableRecipes = data.flatMap((item) => item.results || []);
        } else {
          this.availableRecipes = data.results || [];
        }
        console.log('Beschikbare recepten:', this.availableRecipes);
      },
      error: (err) => {
        console.error('Error bij het laden van recepten:', err);
      },
    });
  }

  toggleCategorie(categorie: KookclubCategorie): void {
    const index = this.categorieen.indexOf(categorie);
    if (index === -1) {
      this.categorieen.push(categorie);
    } else {
      this.categorieen.splice(index, 1);
    }
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
    const newKookclub: Partial<IKookclub> = {
      naam: this.kookclubNaam,
      beschrijving: this.beschrijving,
      categorieen: this.categorieen, // Gebruik de geselecteerde categorieën
      recepten: this.selectedRecepten.map((id) => ({ _id: id, title: '', description: '' })), // Alleen IDs
    };

    this.kookclubService.createKookclub(newKookclub).subscribe({
      next: () => {
        alert('Kookclub aangemaakt!');
        this.router.navigate(['/kookclubs']);
      },
      error: (err) => {
        console.error('Error bij het aanmaken van de kookclub:', err);
      },
    });
  }
}
