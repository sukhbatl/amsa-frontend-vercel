import { Component, NgModule, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {TitleService} from '../../services/title.service';
import {AuthService} from '../auth.service';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    imports: [
        InputTextModule,
        FormsModule,
        CommonModule,
        ButtonModule,
        RouterLink
    ]
})
export class VerifyComponent implements OnInit {
  message = '';
  isLoading = false;
  type = 0;
  email = '';
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private titleService: TitleService,
    private messageService: MessageService
  ) { }

  sendEmail() {
    this.authService.verifyEmailAgain(this.email).then((res) => {
      this.isLoading = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message, life: 5000 });
    }).catch(e => {
      this.isLoading = false;
      console.log(e);
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.titleService.setTitle('Verify Email');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('email') && paramMap.has('hash')) {
        this.type = 1;
        const email = paramMap.get('email') ?? '';
        const hash = paramMap.get('hash') ?? '';
        this.authService.verifyEmail(email, hash).then((res) => {
          this.isLoading = false;
          this.message = res.message;
        }).catch(e => {
          this.isLoading = false;
          console.log(e);
        });
      } else if (paramMap.has('email')) {
        this.email = paramMap.get('email') ?? '';
        if (this.email === 'email') {
          this.type = 3;
          this.message = 'Please enter your email';
        } else {
          this.type = 2;
          this.isLoading = false;
          this.message = 'Verification email has been sent to ' + this.email;
        }
      } else {
        this.isLoading = false;
        this.message = 'Wrong URL';
      }
    });
  }
}
