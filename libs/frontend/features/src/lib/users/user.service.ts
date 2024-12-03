import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserInfo, UserResponse } from '@avans-nx-workshop/shared/api';
import { environment} from '@avans-nx-workshop/shared/util-env'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.dataApiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUserInfo[]> {
    return this.http.get<IUserInfo[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${this.apiUrl}/${id}`);
  }

  updateUser(updatedUser: Partial<IUserInfo>): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${updatedUser._id}`, updatedUser);
  }
  getProfile(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/profile/${userId}`);
  }
}
