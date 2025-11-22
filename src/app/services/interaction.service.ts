import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = environment.apiUrl + '/interact';

@Injectable({
  providedIn: 'root'
})

export class InteractionService {

  constructor(
    private http: HttpClient
  ) { }

  likeOrDislikePost(PostId: number) {
    return this.http.post(BACKEND_URL + '/like', {PostId}).toPromise();
  }

  commentPost(PostId: number, content: string) {
    return this.http.post(BACKEND_URL + '/comment', {PostId, content}).toPromise();
  }
}
