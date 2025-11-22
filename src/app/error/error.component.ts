import {Component, Inject} from '@angular/core';
import { DialogRef } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    standalone: true,
    imports: [CommonModule, ButtonModule]
})
export class ErrorComponent {
  message: string = 'An unknown error occurred!';

  constructor(@Inject('dialogData') public data?: {message: string}) {
    if (this.data && this.data.message) {
      this.message = this.data.message;
    }
  }

  close() {
    // Dialog will close automatically
  }
}
