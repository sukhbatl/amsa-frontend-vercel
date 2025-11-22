import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {PostsService} from '../posts/posts.service';
import {SinglePostModel} from './post.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {TitleService} from '../services/title.service';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {InteractionService} from '../services/interaction.service';
import { MatLegacySnackBar as MessageService } from '@angular/material/legacy-snack-bar';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import { Observable } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: false
})

export class PostComponent implements OnInit, OnDestroy {
  private authStateListenerSubs: Subscription;
  isLoading = false;
  commentForm: UntypedFormGroup;
  backendUrl = environment.backendUrl;
  post: SinglePostModel;
  userID: number;
  userIsAuthenticated = false;
  translationText$: Observable<any>;
  constructor(
    private titleService: TitleService,
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder,
    private interactionService: InteractionService,
    private snackBar: MessageService,
    private authService: AuthService,
    private languageService: LanguageService,
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
   }

  ngOnInit() {
    this.userID = this.authService.getUserId();
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.authStateListenerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userID = this.authService.getUserId();
      }
    );
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
          const id = paramMap.get('id');
          this.postsService.getPost(id).then((res) => {
            this.post = res;
            this.titleService.setTitle(this.post.type[0].toUpperCase() + this.post.type.slice(1));
            this.isLoading = false;
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.authStateListenerSubs.unsubscribe();
  }

  deletePost() {
    this.postsService.deletePost(this.post.id).then(res => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Post Deleted!', life: 5000 });
      if (this.post.type === 'article') {
        this.router.navigate(['/articles']);
      } else {
        this.router.navigate(['/posts']);
      }
    }).catch(e => {
      console.log(e);
    });
  }

  submitComment(form) {
    this.interactionService.commentPost(this.post.id, this.commentForm.value.content).then((res) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Comment Submitted!', life: 5000 });
      form.resetForm();
      this.commentForm.reset();
      const comment = res['comment'];
      comment['User'] = this.post.User;

      this.post.Comments.unshift(comment);
    }).catch((err) => {
      console.log(err);
    });
    console.log(this.commentForm.value);
  }
}
