import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRecipe, IRecipeResponse, RecipeListResponse } from '@avans-nx-workshop/shared/api';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { AuthService } from '@avans-nx-workshop/features';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = `${environment.dataApiUrl}/recipe`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log
    if (!token) {
      console.error('No JWT token found');
    }
    console.log('found token ' + token)
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`, // Voeg token toe aan de heade
    }
  );
  }

  getRecipes(): Observable<RecipeListResponse> {
    const headers = this.createAuthHeaders();
    return this.http.get<RecipeListResponse>(this.apiUrl, { headers });
  }

  getRecipeById(id: string): Observable<IRecipeResponse> {
    const headers = this.createAuthHeaders();
    return this.http.get<IRecipeResponse>(`${this.apiUrl}/${id}`, { headers });
  }

  createRecipe(recipe: IRecipe): Observable<IRecipe> {
    const headers = this.createAuthHeaders();
    console.log('Sending recipe to backend:', recipe);
    return this.http.post<IRecipe>(this.apiUrl, recipe, { headers });
  }

  updateRecipe(id: string, recipe: IRecipe): Observable<IRecipe> {
    const headers = this.createAuthHeaders();
    return this.http.put<IRecipe>(`${this.apiUrl}/${id}`, recipe, { headers });
  }

  deleteRecipe(id: string): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}

export default RecipeService;
