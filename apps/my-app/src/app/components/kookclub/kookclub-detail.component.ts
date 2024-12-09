import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KookclubService } from '@avans-nx-workshop/features';
import { IKookclub, IRecipe } from '@avans-nx-workshop/shared/api';
import { AuthService } from '@avans-nx-workshop/features';

@Component({
  selector: 'app-kookclub-detail',
  templateUrl: './kookclub-detail.component.html',
  styleUrls: [],
})
export class KookclubDetailComponent implements OnInit {
  kookclub: IKookclub | null = null;
  errorMessage: string | null = null;
  isOwner: boolean = false;
  isMember: boolean = false;
  availableRecipes: IRecipe[] = [];
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kookclubService: KookclubService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUserId() || '';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getKookclubDetail(id);
      this.loadAvailableRecipes();
    } else {
      this.errorMessage = 'Kookclub ID ontbreekt in de route.';
    }
  }

  getKookclubDetail(id: string): void {
    this.kookclubService.getKookclubById(id).subscribe({
      next: (data) => {
        this.kookclub = data;
        this.checkOwnership();
        this.checkMembership();
      },
      error: (err) => {
        console.error('Fout bij ophalen van kookclubdetails:', err);
        this.errorMessage = 'Kon kookclub niet ophalen.';
      },
    });
  }

  checkOwnership(): void {
    console.log('Controleer eigenaar:', this.kookclub?.eigenaar, 'User ID:', this.userId);
  
    if (this.kookclub?.eigenaar && typeof this.kookclub.eigenaar !== 'string') {
      console.log('Eigenaar structuur:', this.kookclub.eigenaar);
      this.isOwner = this.kookclub.eigenaar._id === this.userId;
      console.log('Is eigenaar:', this.isOwner);
    } else if (typeof this.kookclub?.eigenaar === 'string') {
      console.warn('Eigenaar is een string, verwacht een object:', this.kookclub.eigenaar);
    } else {
      console.warn('Eigenaar is niet correct ingesteld of mist.');
    }
  }
  

  checkMembership(): void {
    if (this.kookclub?.leden.includes(this.userId)) {
      this.isMember = true;
    }
  }

  loadAvailableRecipes(): void {
    this.kookclubService.getAvailableRecipes().subscribe({
      next: (data) => {
        this.availableRecipes = data.results || [];
      },
      error: (err) => {
        console.error('Fout bij ophalen van recepten:', err);
      },
    });
  }

  addRecipeToKookclub(recipeId: string): void {
    if (this.kookclub) {
      this.kookclubService.addRecipeToKookclub(this.kookclub._id, recipeId).subscribe({
        next: () => {
          alert('Recept toegevoegd aan kookclub!');
          this.getKookclubDetail(this.kookclub!._id);
        },
        error: (err) => console.error('Fout bij toevoegen van recept:', err),
      });
    }
  }

  joinKookclub(): void {
    if (this.kookclub) {
      this.kookclubService.joinKookclub(this.kookclub._id).subscribe({
        next: () => {
          alert('Je bent nu lid van deze kookclub!');
          this.getKookclubDetail(this.kookclub!._id);
        },
        error: (err) => console.error('Fout bij lid worden van kookclub:', err),
      });
    }
  }

  leaveKookclub(): void {
    if (this.kookclub) {
      this.kookclubService.leaveKookclub(this.kookclub._id).subscribe({
        next: () => {
          alert('Je hebt de kookclub verlaten.');
          this.getKookclubDetail(this.kookclub!._id);
        },
        error: (err) => console.error('Fout bij verlaten van kookclub:', err),
      });
    }
  }

  editKookclub(): void {
    if (this.kookclub) {
      this.router.navigate(['/kookclubs', this.kookclub._id, 'edit']);
    }
  }

  deleteKookclub(): void {
    if (this.kookclub) {
      const confirmed = confirm('Weet je zeker dat je deze kookclub wilt verwijderen?');
      if (confirmed) {
        this.kookclubService.deleteKookclub(this.kookclub._id).subscribe({
          next: () => {
            alert('Kookclub succesvol verwijderd.');
            this.router.navigate(['/kookclubs']);
          },
          error: (err) => console.error('Fout bij verwijderen van kookclub:', err),
        });
      }
    }
  }
  getEigenaarNaam(eigenaar: string | { name: string; _id: string } | undefined): string {
    if (!eigenaar) {
      return 'Onbekend'; // Indien eigenaar `undefined` of `null` is
    }
    if (typeof eigenaar === 'object' && eigenaar.name) {
      return eigenaar.name; // Als eigenaar een object is met een `name` veld
    }
    if (typeof eigenaar === 'string') {
      return eigenaar; // Als eigenaar een string-ID is
    }
    return 'Onbekend'; // Default fallback
  }
}
