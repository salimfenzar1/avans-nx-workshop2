import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IKookclub, RecipeListResponse } from '@avans-nx-workshop/shared/api'; // Zorg dat dit correct is geïmporteerd
import { environment } from '@avans-nx-workshop/shared/util-env';
import { AuthService } from '@avans-nx-workshop/features';

@Injectable({
  providedIn: 'root',
})
export class KookclubService {
  private apiUrl = `${environment.dataApiUrl}/kookclubs`;
  private recipeApiUrl = `${environment.dataApiUrl}/recipe`; // Endpoint voor recepten

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`, // Voeg token toe aan headers
    });
  }

  // Maak een nieuwe kookclub aan
  createKookclub(data: Partial<IKookclub>): Observable<IKookclub> {
    const headers = this.createAuthHeaders();
    return this.http.post<IKookclub>(this.apiUrl, data, { headers });
  }

  // Haal alle kookclubs op
  getAllKookclubs(): Observable<IKookclub[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<{ results: IKookclub[] }>(this.apiUrl, { headers }).pipe(
      map(response => response.results) // Extract the array from the response object
    );
  }
  

  // Haal details van een specifieke kookclub op
  getKookclubById(id: string): Observable<IKookclub> {
    const headers = this.createAuthHeaders();
    return this.http.get<{ results: IKookclub }>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map((response) => {
        const kookclub = response.results;
        return kookclub;
      })
    );
  }
  
  // Word lid van een kookclub
  joinKookclub(kookclubId: string): Observable<IKookclub> {
    const headers = this.createAuthHeaders();
    return this.http.put<IKookclub>(`${this.apiUrl}/${kookclubId}/join`, {}, { headers });
  }

  // Verlaat een kookclub
  leaveKookclub(kookclubId: string): Observable<IKookclub> {
    const headers = this.createAuthHeaders();
    return this.http.put<IKookclub>(`${this.apiUrl}/${kookclubId}/leave`, {}, { headers });
  }

  // Haal alle beschikbare recepten op
  getAvailableRecipes(): Observable<RecipeListResponse> {
    const headers = this.createAuthHeaders();
    return this.http.get<RecipeListResponse>(this.recipeApiUrl, { headers });
  }
  // Voeg een recept toe aan een kookclub
  addRecipeToKookclub(kookclubId: string, recipeId: string): Observable<IKookclub> {
    const headers = this.createAuthHeaders();
    return this.http.put<IKookclub>(
      `${this.apiUrl}/${kookclubId}/recipes`,
      { recipeId },
      { headers }
    );
  }

  // Verwijder een kookclub (alleen eigenaar)
  deleteKookclub(kookclubId: string): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${kookclubId}`, { headers });
  }
}
