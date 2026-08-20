import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div class="app-shell"><router-outlet></router-outlet></div>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nvidia-nemotron';
}
