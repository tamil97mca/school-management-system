import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  ngOnInit(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    })
  }
}
