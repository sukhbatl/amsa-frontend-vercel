import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {PostModel} from './posts.model';
import {SinglePostModel, UpdatePostModel} from '../post/post.model';
import {firstValueFrom} from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private http: HttpClient
  ) { }

  getRecentPosts(pageNumber: number, pageSize: number) {
    const query = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<PostModel[]>(BACKEND_URL + '/recentPosts' + query).toPromise();
  }

  getRecentArticles(pageNumber: number, pageSize: number) {
    const query = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return firstValueFrom(this.http.get<PostModel[]>(BACKEND_URL + '/recentArticles' + query));
  }

  getPost(id: string) {
    return firstValueFrom(this.http.get<SinglePostModel>(BACKEND_URL + '/content/' + id));
  }

  createPost(title: string, subTitle: string, content: string, type: string, category: string, image: File, tags: string) {
    const postData = new FormData();
    postData.append('image', image);
    postData.append('title', title);
    postData.append('subTitle', subTitle);
    postData.append('content', content);
    postData.append('category', category);
    postData.append('type', type);
    postData.append('tags', tags);

    if (type === 'article') {
      return this.http.post(BACKEND_URL + '/newArticle', postData).toPromise();
    }
    return this.http.post(BACKEND_URL + '/newPost', postData).toPromise();

  }

  updatePost(id: number, title: string, subTitle: string, content: string, category: string, image: File | string, tags: string) {
    let postData: UpdatePostModel | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id.toString());
      postData.append('title', title);
      postData.append('subTitle', subTitle);
      postData.append('content', content);
      postData.append('category', category);
      postData.append('image', image);
      postData.append('tags', tags);
    } else {
      postData = {id, title, subTitle, content, category, picUrl: image, tags};
    }

    return this.http.put(`${BACKEND_URL}/updatePost/${id}`, postData).toPromise();
  }

  deletePost(id: number) {
    return this.http.delete(`${BACKEND_URL}/deletePost/${id}`).toPromise();
  }
}
