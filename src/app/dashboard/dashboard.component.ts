import { Component, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '../../app/services/api/dashboard.service';
import { HttpStatus } from 'src/helper/httpStatus';
import { ToasterService } from '../services/toaster.service';
import {
  CategoryScale,
  Chart,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
    private toaster: ToasterService
  ) {}

  private formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString.substring(0, isoString.length - 5);
  }

  ngOnInit() {
    this.countOfBookingStatus();
    this.listOfLatestBooking();
    this.loadData();
  }

  ngAfterViewInit() {
    this.getGraphData();
  }

  loadData(): void {
    this.getGraphData();
  }

  getGraphData() {
    this.dashboardService.getGraphOfUser().subscribe((res: any) => {
      if (res && res.statusCode === HttpStatus.OK) {
        this.graphData = res.data;
        this.renderGraphChart();
      }
    });
  }

  renderGraphChart() {
    const ctx = document.getElementById('chart1') as HTMLCanvasElement;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    Chart.register(
      LineController,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Legend,
      Tooltip,
      CategoryScale
    );

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.graphData.map((item) => item.Year),
        datasets: [
          {
            label: 'Graph of User',
            data: this.graphData.map((item) => item.countOfTotalUser),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2, 
          },
        ],
      },
    });
  }

  // renderChart(): void {
  //   const ctx = this.chartCanvas.nativeElement.getContext('2d');
  //   new Chart(ctx, {
  //     type: 'doughnut', // or 'pie'
  //     data: {
  //       labels: this.graphData.map((item) => item.Year),
  //       datasets: [
  //         {
  //           label: 'Graph of User',
  //           data: this.graphData.map((item) => item.countOfTotalUser),
  //           backgroundColor: ['rgba(75, 192, 192, 0.2)'],
  //           borderColor: ['rgba(75, 192, 192, 1)'],
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //   });
  // }

  onPageChanged(page: number): void {
    this.currentPage = page;
    // this.countOfBookingStatus();
    // this.listOfLatestBooking();
  }

  countOfBookingStatus() {
    this.dashboardService
      .getCountOfBookingStatus()
      .subscribe((response: any) => {
        if (response.statusCode === HttpStatus.OK) {
          this.countOfStatus = response.data[0];
        } else {
          this.showMessage(response.message, 'dismiss');
        }
      });
  }

  listOfLatestBooking() {
    this.dashboardService.getLatestBookingData().subscribe((response: any) => {
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
    });
  }

  showMessage(message: string, action: string) {
    this.toaster.showMessage(message, action);
  }
}
