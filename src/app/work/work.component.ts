import { Component, OnInit } from '@angular/core';
import {TitleService} from './../services/title.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-work',
    templateUrl: './work.component.html',
    imports: [
        RouterLink
    ]
})
export class WorkComponent implements OnInit {

  constructor(
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Our Projects');
  }

}
