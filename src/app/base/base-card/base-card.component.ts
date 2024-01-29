import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-base-card',
  templateUrl: './base-card.component.html',
  styleUrls: ['./base-card.component.css'],
})
export class BaseCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() cardClass: string = '';
  @Input() valueClass: string = '';
  @Input() iconClass: string = '';
  dataSource: any;
  data: any;
  totalItemsCount: any;
  currentPage: any;
  pageSize: any;
  displayedData: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
      this.dataSource.filter = '';
      this.totalItemsCount = this.data.length; // Set the totalItemsCount

      // Add the following line to update displayedData
      this.updateDisplayedData();
    }
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = this.data.slice(startIndex, endIndex);
  }
}
