import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {MembersModel} from './members.model';
const BACKEND_URL = environment.apiUrl + '/user';
@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(
    private http: HttpClient
  ) { }

  getMembers() {
    return this.http.get<MembersModel>(BACKEND_URL + '/members').toPromise();
  }
}
