import { Component, OnInit } from '@angular/core';
import { PreloaderService } from '../common';

@Component({
  selector: 'app-preloader-full',
  templateUrl: './preloader-full.component.html',
  styleUrls: ['./preloader-full.component.css']
})
export class PreloaderFullComponent implements OnInit {

  constructor(public preloaderService: PreloaderService) { }

  ngOnInit() {
  }

}
