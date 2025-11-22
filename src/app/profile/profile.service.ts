import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ProfileModel, UpdatedProfileModel, changeProfilePictureModel} from './profile.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/user';
const BACKEND_URLUSER = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient
  ) { }

  getMyProfile() {
    return firstValueFrom(this.http.get<ProfileModel>(BACKEND_URL + '/profile'));
  }

  getUserProfile(id: any) {
    return firstValueFrom(this.http.get<ProfileModel>(BACKEND_URL + '/profile/' + id));
  }

  getPublicUserProfile(id: any) {
    return firstValueFrom(this.http.get<ProfileModel>(BACKEND_URL + '/public-profile/' + id));
  }

  changeProfilePicture(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    return firstValueFrom(this.http.put<changeProfilePictureModel>(BACKEND_URL + '/profilePic', formData));
  }

  updateUserProfile(newUser: UpdatedProfileModel) {
    return firstValueFrom(this.http.put(BACKEND_URL + '/profile', newUser));
  }

  updatePassword(body: any) {
    return firstValueFrom(this.http.put<{message: string}>(BACKEND_URLUSER + '/changePassword', body));
  }
}
