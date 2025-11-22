import { Component, OnInit } from '@angular/core';
import { TitleService } from '../services/title.service';
import { MembersService } from './members.service';
import { MembersModel } from './members.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../src/app/services/language.service';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserCardComponent } from '../common/user-card/user-card.component';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    imports: [
        CommonModule,
        AccordionModule,
        ProgressSpinnerModule,
        UserCardComponent,
    ]
})

export class MembersComponent implements OnInit {
  members: MembersModel | undefined;
  isLoading = false;
  backendUrl = environment.backendUrl;
  translationText$: Observable<any>;

  constructor(
    private titleService: TitleService,
    private membersService: MembersService,
    private languageService: LanguageService,
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
  }

  ngOnInit() {
    this.isLoading = true;
    this.titleService.setTitle('All Team Members');
    this.membersService.getMembers().then(res => {
      this.members = res;
      this.isLoading = false;
    }).catch(e => {
      this.isLoading = false;
    })
  }
}