import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRecipe, IRecipeResponse, RecipeListResponse } from '@avans-nx-workshop/shared/api';
import { environment } from '@avans-nx-workshop/shared/util-env';


@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = `${environment.dataApiUrl}/recipe`;

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<RecipeListResponse> {
    return this.http.get<RecipeListResponse>(this.apiUrl);
  }

  getRecipeById(id: string): Observable<IRecipeResponse> {
    return this.http.get<IRecipeResponse>(`${this.apiUrl}/${id}`);
  }

  createRecipe(recipe: IRecipe): Observable<IRecipe> {
    console.log('Sending recipe to backend:', recipe);
    return this.http.post<IRecipe>(this.apiUrl, recipe);
  }

  updateRecipe(id: string, recipe: IRecipe): Observable<IRecipe> {
    return this.http.put<IRecipe>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

export default RecipeService; 
