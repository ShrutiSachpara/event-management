import { Component, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '../../app/services/api/dashboard.service';
import { HttpStatus } from 'src/helper/httpStatus';
import { ToasterService } from '../services/toaster.service';
import { ChartService } from '../services/api/chart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  countOfStatus: any;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 7;
  flattenedBookingData: any[] = [];
  sortedColumn: string = 'order_id';
  isAscending: boolean = true;
  graphData: any[] = [];

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  constructor(
    private dashboardService: DashboardService,
    private toaster: ToasterService,
    private chartService: ChartService
  ) {}

  private formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString.substring(0, isoString.length - 5);
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.getGraphData();
  }

  loadData(): void {
    Promise.all([
      this.countOfBookingStatus(),
      this.listOfLatestBooking(),
      this.loadData(),
      this.getGraphData(),
    ]);
  }

  getGraphData(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.dashboardService.getGraphOfUser().subscribe((res: any) => {
        if (res && res.statusCode === HttpStatus.OK) {
          this.graphData = res.data;
          this.renderGraphChart();
        }
        resolve();
      });
    });
  }

  renderGraphChart(): void {
    const labels = this.graphData.map((item) => item.Year);
    const data = this.graphData.map((item) => item.countOfTotalUser);
    const borderColor = 'rgba(75, 192, 192, 1)';
    this.chartService.createPieChart(
      'chart1',
      labels,
      data,
      'Graph of User',
      borderColor
    );
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.listOfLatestBooking();
  }

  countOfBookingStatus(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.dashboardService
        .getCountOfBookingStatus()
        .subscribe((response: any) => {
          if (response.statusCode === HttpStatus.OK) {
            this.countOfStatus = response.data[0];
          } else {
            this.showMessage(response.message, 'dismiss');
          }
          resolve();
        });
    });
  }

  listOfLatestBooking(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.dashboardService
        .getLatestBookingData()
        .subscribe((response: any) => {
          if (response.statusCode === HttpStatus.OK) {
            this.flattenedBookingData = response.data.map((booking: any) => ({
              id: booking.id,
              name: booking.auth_user?.name,
              phone_number: booking.auth_user?.phone_number,
              email: booking.auth_user?.email,
              event_date: this.formatDate(booking.event_date),
              status: booking.status,
            }));

            this.totalPages = Math.ceil(
              this.flattenedBookingData.length / this.pageSize
            );
          } else {
            this.showMessage(response.message, 'dismiss');
          }
          resolve();
        });
    });
  }

  showMessage(message: string, action: string) {
    this.toaster.showMessage(message, action);
  }
}
