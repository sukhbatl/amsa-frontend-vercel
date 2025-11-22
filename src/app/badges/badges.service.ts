import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BadgeModel, BadgeUsersModel } from './badges.model';
import { ShortUserModel } from '../home/home.model';
import {firstValueFrom} from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/badge';

@Injectable({
  providedIn: 'root'
})
export class BadgesService {

  constructor(private http: HttpClient) { }

  getAllBadges() {
    return firstValueFrom(this.http.get<BadgeModel[]>(BACKEND_URL + '/all'));
  }

  assignBadge(UserId: number, BadgeId: number) {
    const body = {
      UserId,
      BadgeId,
    };
    return firstValueFrom(this.http.post(BACKEND_URL + '/assign', body));
  }

  createBadge(name: string, title: string, description: string, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('description', description);
    return firstValueFrom(this.http.post(BACKEND_URL + '/new', formData));
  }

  deleteBadge(id: number) {
    return firstValueFrom(this.http.delete(BACKEND_URL + '/' + id.toString()));
  }

  getAllUsers(id: string) {
    return firstValueFrom(this.http.get<BadgeUsersModel>(BACKEND_URL + '/users/' + id));
  }

  getClassYear() {
    return firstValueFrom(this.http.get<BadgeUsersModel>(environment.apiUrl + '/members/graduation-year'));
  }
}
