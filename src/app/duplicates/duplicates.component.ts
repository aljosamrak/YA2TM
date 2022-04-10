import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'duplicates',
  templateUrl: './duplicates.component.html',
  styleUrls: ['./duplicates.component.sass'],
})
export class DuplicatesComponent implements OnInit {
  constructor() {}

  data = ''

  ngOnInit(): void {
    chrome.runtime.getBackgroundPage(
      function (bg: any) {
        if (bg) {
          // @ts-ignore
          ;(this as DuplicatesComponent).data = bg.myUrl
          // alert(myUrl)
        }
      }.bind(this),
    )
  }
}
