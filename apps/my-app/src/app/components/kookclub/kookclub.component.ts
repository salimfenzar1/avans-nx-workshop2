import { Component, OnInit } from '@angular/core';
import { KookclubService } from '@avans-nx-workshop/features'; // Zorg dat dit correct is geïmporteerd
import { IKookclub } from '@avans-nx-workshop/shared/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kookclubs',
  templateUrl: './kookclub.component.html',
  styleUrls: [],
})
export class KookclubComponent implements OnInit {
  kookclubs: IKookclub[] = [];

  constructor(private kookclubService: KookclubService, private router: Router) {}

  ngOnInit(): void {
    this.loadKookclubs();
  }

  loadKookclubs(): void {
    this.kookclubService.getAllKookclubs().subscribe({
      next: (data) => {
        this.kookclubs = data;
      },
      error: (err) => {
        console.error('Fout bij het ophalen van kookclubs:', err);
      },
    });
  }

  viewKookclub(id: string): void {
    this.router.navigate(['/kookclubs', id]);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  createKookclub(): void {

    this.router.navigate(['/kookclubs/create']);
  }
  getEigenaarNaam(eigenaar: string | { name: string; _id: string }): string {
    if (typeof eigenaar === 'object' && eigenaar.name) {
      return eigenaar.name; // Als eigenaar een object is, retourneer de `name` property
    }
    return typeof eigenaar === 'string' ? eigenaar : 'Onbekend'; // Anders retourneer de string of 'Onbekend'
  }
  

}
