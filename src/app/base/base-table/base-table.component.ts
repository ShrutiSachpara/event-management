import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.css'],
})
export class BaseTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() pageSize: number = 7;
  @Input() currentPage: number = 1;
  @Input() columns: string[] = [];
  @Input() sortedColumn: string = '';
  @Input() isAscending: boolean = true;
  @Input() columnActionTemplate: any; 
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  totalItemsCount: number = 0;
  displayedData: any[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  private searchSubject = new Subject<string>();

  constructor() {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
      this.dataSource.filter = '';
      this.updateDisplayedData();
    }
  }

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.dataSource.filter = value.trim().toLowerCase();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }
  editRecord(item: any) {
    this.onEdit.emit(item);
  }
  deleteRecord(item: any) {
    this.onDelete.emit(item);
  }

  getColumnValue(item: any, column: string): any {
    if (item.hasOwnProperty(column)) {
      return item[column];
    } else {
      console.warn(`Property '${column}' does not exist in the data item.`);
      return '';
    }
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.updateDisplayedData();
    this.pageChanged.emit(newPage);
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = this.dataSource.data.slice(startIndex, endIndex);
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
