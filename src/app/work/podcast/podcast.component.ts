import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../services/title.service';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-podcast',
    templateUrl: './podcast.component.html',
    imports: [
        // RouterLink,
        ButtonModule,
        CardModule
    ]
})
export class PodcastComponent implements OnInit {

  constructor(
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Podcast')
  }

}
