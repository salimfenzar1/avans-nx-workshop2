import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KookclubService } from '@avans-nx-workshop/features';
import { IKookclub, KookclubCategorie, IRecipe } from '@avans-nx-workshop/shared/api';
import { Kookclub } from 'libs/backend/user/src/lib/kookClub/kookClub.schema';

@Component({
  selector: 'app-kookclub-edit',
  templateUrl: './kookclub-edit.component.html',
  styleUrls: [],
})
export class KookclubEditComponent implements OnInit {
  naam: string = '';
  beschrijving: string = '';
  categorieen: KookclubCategorie[] = []; 
  availableCategories = Object.values(KookclubCategorie); 
  availableRecipes: IRecipe[] = [];
  selectedRecipeIds: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kookclubService: KookclubService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.kookclubService.getKookclubById(id).subscribe({
        next: (data) => {
          this.naam = data.naam;
          this.beschrijving = data.beschrijving;
          this.categorieen = data.categorieen; 
          this.selectedRecipeIds = data.recepten.map((r) => r._id);
        },
        error: (err) => {
          console.error('Fout bij ophalen kookclub:', err);
        },
      });
    }

    this.loadAvailableRecipes();
  }

  loadAvailableRecipes(): void {
    this.kookclubService.getAvailableRecipes().subscribe({
      next: (data) => {
        this.availableRecipes = data.results || [];
      },
      error: (err) => {
        console.error('Fout bij ophalen recepten:', err);
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
    const index = this.selectedRecipeIds.indexOf(recipeId);
    if (index === -1) {
      this.selectedRecipeIds.push(recipeId);
    } else {
      this.selectedRecipeIds.splice(index, 1);
    }
  }

  saveKookclub(): void {
    const updatedKookclub = {
      naam: this.naam,
      beschrijving: this.beschrijving,
      categorieen: this.categorieen, 
      recepten: this.selectedRecipeIds,
    };
    const kookclubId = this.route.snapshot.paramMap.get('id');
    this.kookclubService.updateKookclub(this.route.snapshot.paramMap.get('id')!, updatedKookclub).subscribe({
      next: () => {
        this.router.navigate([`/kookclubs/${kookclubId}`]);
      },
      error: (err) => {
        console.error('Fout bij het bijwerken van de kookclub:', err);
      },
    });
  }
}
