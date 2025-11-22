import { Component, OnInit } from '@angular/core';
import {TitleService} from '../services/title.service';
import {PostsService} from './posts.service';
import {PostModel} from './posts.model';
import {environment} from '../../environments/environment';
import {InteractionService} from '../services/interaction.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SocialSharingService, ShareData } from '../services/social-sharing.service';
import { SocialSharingComponent } from '../common/social-sharing/social-sharing.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    CardModule,
    RouterLink,
    ButtonModule,
    ToastModule,
    SocialSharingComponent,
  ]
})
export class PostsComponent implements OnInit {
  isLoading = false;
  backendUrl = environment.backendUrl;
  posts: PostModel[] = [];
  pageSize = 8;
  pageNumber = 0;
  constructor(
    private titleService: TitleService,
    private postsService: PostsService,
    private interactionService: InteractionService,
    private messageService: MessageService,
    private socialSharingService: SocialSharingService,
    private router: Router
  ) { }

  likeOrDislikePost(id: number) {
    this.interactionService.likeOrDislikePost(id).then((res) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Action taken!', life: 5000 });
    }).catch((err) => {
      console.log(err);
    })
  }

  ngOnInit() {
    this.isLoading = true;
    this.titleService.setTitle('Member Blog');
    this.postsService.getRecentPosts(this.pageNumber, this.pageSize).then((res) => {
      this.posts = res;
      this.isLoading = false;
    }).catch((err) => {
      console.log(err);
    });
  }

  nextBatch() {
    this.pageNumber++;
    this.postsService.getRecentPosts(this.pageNumber, this.pageSize).then((res) => {
      this.posts = res;
      this.isLoading = false;
    }).catch(e => {
      console.log(e);
      this.isLoading = false;
    });
  }

  previousBatch() {
    this.pageNumber = Math.max(this.pageNumber - 1, 0);
    this.postsService.getRecentPosts(this.pageNumber, this.pageSize).then((res) => {
      this.posts = res;
      this.isLoading = false;
    }).catch(e => {
      console.log(e);
      this.isLoading = false;
    });
  }

  getPostShareData(post: PostModel): ShareData {
    return this.socialSharingService.generatePostShareData(post);
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }

}
