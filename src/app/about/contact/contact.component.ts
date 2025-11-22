import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../services/title.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    imports: [
        CommonModule
    ]
})
export class ContactComponent implements OnInit {

  constructor(
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Contact Us');
  }

}
