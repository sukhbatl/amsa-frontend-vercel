import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {QuickSearchModel} from '../models/search.model';

const BACKEND_URL = environment.apiUrl + '/search';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient
  ) { }

  quickSearch(q: string) {
    return this.http.get<QuickSearchModel>(BACKEND_URL + '/quick?q=' + q).toPromise();
  }

  allSearch(q: string, pageSize: number, pageNumber: number ) {
    return this.http.get<QuickSearchModel>(`${BACKEND_URL}/all?q=${q}&pageSize=${pageSize}&pageNumber=${pageNumber}`).toPromise();
  }
}
