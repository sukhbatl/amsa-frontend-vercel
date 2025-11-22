import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HomeModel} from './home.model';
import { interval, firstValueFrom } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/home';

@Injectable({
  providedIn: 'root',
})

export class HomeService {

  constructor(
    private http: HttpClient
  ) { }

  getHomeInfo() {
    return firstValueFrom(this.http.get<HomeModel>(BACKEND_URL));
  }
}
