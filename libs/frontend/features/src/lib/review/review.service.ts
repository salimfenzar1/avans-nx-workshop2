import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReview, IReviewResponse } from '@avans-nx-workshop/shared/api';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { Observable } from 'rxjs';
import { AuthService } from '@avans-nx-workshop/features';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.dataApiUrl}/reviews`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No JWT token found');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`, // Voeg het token toe aan de headers
    });
  }

  addReview(userId: string, recipeId: string, rating: number, comment: string): Observable<IReview> {
    const headers = this.createAuthHeaders();
    return this.http.post<IReview>(
      `${this.apiUrl}`,
      { userId, recipeId, rating, comment },
      { headers }
    );
  }

  getReviews(recipeId: string): Observable<IReviewResponse> {
    const headers = this.createAuthHeaders();
    return this.http.get<IReviewResponse>(`${this.apiUrl}/${recipeId}`, { headers });
  }
}
