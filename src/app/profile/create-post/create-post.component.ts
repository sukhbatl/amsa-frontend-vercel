import { Component, OnInit } from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {PostsService} from '../../posts/posts.service';
import {MessageService } from 'primeng/api';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {TitleService} from '../../services/title.service';
import {environment} from '../../../environments/environment';
import {mimeType} from '../../../validators/mime-type.validator';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    imports: [
        CommonModule,
        ProgressSpinnerModule,
        InputTextModule,
        FormsModule,
        SelectModule,
        TabsModule,
        ReactiveFormsModule,
        ToastModule,
        ButtonModule,
    ]
})

export class CreatePostComponent implements OnInit {
  newPostForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(190)]],
    subTitle: ['', [Validators.required, Validators.maxLength(190)]],
    image: [null, [Validators.required], [mimeType]],
    category: ['', [Validators.required]],
    tags: ['', [Validators.required]]
  });
  isLoading = false;
  imagePreviewUrl: string | ArrayBuffer = '';
  backendUrl = environment.backendUrl;
  type = 'create';
  postID = -1;
  content: string = '';
  categoryOptions = [
    { label: 'Educational', value: 'education' },
    { label: 'News', value: 'news' },
    { label: 'BUOP', value: 'buop' },
    { label: 'AGM', value: 'agm' }
  ];
  constructor(
    private postsService: PostsService,
    private messageService: MessageService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) { }

  createArticle() {
    const title = this.newPostForm?.value['title'];
    const subTitle = this.newPostForm?.value['subTitle'];
    const content = this.content;
    const category = this.newPostForm?.value['category'];
    const tags = this.newPostForm?.value['tags'];

    if (content.length > 25000) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Content cannot be larger than 25000 characters', life: 5000 });
      return;
    }

    if (this.type === 'create') {
      this.postsService.createPost(title, subTitle, content, 'blog', category, this.newPostForm?.value.image, tags).then((res) => {
        this.onImageUploadSuccess();
        this.imagePreviewUrl = '';
        this.newPostForm?.reset();
        this.content = '';
      }).catch((err) => {
        this.onImageUploadError();
        console.log(err);
      });
    } else {
      this.postsService.updatePost(this.postID, title, subTitle, content, category, this.newPostForm?.value.image, tags).then((res) => {
        this.onImageUploadSuccess();
      }).catch(e => {
        this.onImageUploadError();
        console.log(e);
      });
    }
  }

  private onImageUploadSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Created Successfully!', life: 5000 });
  }

  private onImageUploadError() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Creation Failed!', life: 5000 });
  }

  processPostImage(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files![0];
    this.newPostForm.patchValue({image: file});
    this.newPostForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result ?? '';
    };
    reader.readAsDataURL(file);
  }

  ngOnInit() {
    this.isLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isLoading = true;
        const id = paramMap.get('id') ?? '';
        this.postsService.getPost(id).then((res) => {
          this.type = 'edit';
          this.postID = res.id;
          this.newPostForm.setValue({
            title: res.title,
            subTitle: res.subTitle,
            image: res.picUrl,
            category: res.category,
            tags: res.tags
          });
          this.content = res.content;
          this.imagePreviewUrl = this.backendUrl + res.picUrl;
          this.titleService.setTitle('Edit ' + res.type);
          this.isLoading = false;
        }).catch(e => {
          console.log(e);
        });
      } else {
        this.isLoading = false;
      }
    });
  }

}
