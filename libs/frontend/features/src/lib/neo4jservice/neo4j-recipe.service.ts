import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { RecipeListResponse } from '@avans-nx-workshop/shared/api';

@Injectable({
  providedIn: 'root',
})
export class Neo4jRecipeService {
  private neo4jApiUrl = `${environment.neo4jApiUrl}/recipes`;

  constructor(private http: HttpClient) {}

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || ''; 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getPopularRecipes(): Observable<RecipeListResponse> {
    return this.http.get<RecipeListResponse>(`${this.neo4jApiUrl}/popular`);
  }
  
  getBestRatedRecipes(): Observable<RecipeListResponse> {
    return this.http.get<RecipeListResponse>(`${this.neo4jApiUrl}/best-rated`);
  }

  syncRecipes(): Observable<{ message: string }> {
    const headers = this.createAuthHeaders();
    return this.http.post<{ message: string }>(`${this.neo4jApiUrl}/sync`, {}, { headers });
  }

  deleteRecipe(recipeId: string): Observable<{ message: string }> {
    const headers = this.createAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.neo4jApiUrl}/${recipeId}`, { headers });
  }
  
}
