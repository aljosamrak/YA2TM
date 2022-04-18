import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'YA2TM'

  openFullScreen() {
    window.open(chrome.runtime.getURL('index.html'))
  }
}
