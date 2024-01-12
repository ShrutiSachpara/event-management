import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
  constructor(private ngxLoaderService: NgxUiLoaderService) {}

  ngOnInit(): void {
    this.startLoader();

    setTimeout(() => {
      this.stopLoader('loader-1');
    }, 2000);
  }

  startLoader() {
    this.ngxLoaderService.startLoader('default', 'rgba(0,0,0,0.3)');
    this.ngxLoaderService.startLoader('loader-1');
  }

  stopLoader(loaderId: string) {
    this.ngxLoaderService.stopLoader(loaderId);
  }
}
