import { Component } from '@angular/core';
import { ReportService } from '../services/api/report.service';
import { ToasterService } from '../services/toaster.service';
import { HttpStatus } from 'src/helper/httpStatus';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
})
export class ReportComponent {
  constructor(
    private reportService: ReportService,
    private toaster: ToasterService
  ) {}

  flattenedBookingData: any[] = [];
  totalPages: number = 1;
  pageSize: number = 7;
  isAscending: boolean = true;
  currentPage: number = 1;
  sortedColumn: string = 'order_id';
  countOfStatus: any;
  bookingColumns = ['Sr. No', 'name', 'phone_number', 'email', 'event_date'];
  eventColumns = ['Sr. No', 'name', 'event_date'];

  private formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString.substring(0, isoString.length - 5);
  }

  ngOnInit() {
    this.listOfLatestBooking();
    this.listOfLatestEvent();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
  }

  listOfLatestBooking() {
    this.reportService.getBookingReportData().subscribe((response: any) => {
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

  listOfLatestEvent() {
    this.reportService.getEventReportData().subscribe((response: any) => {
      if (response.statusCode === HttpStatus.OK) {
        this.flattenedBookingData = response.data.map((service: any) => ({
          id: service.id,
          event_name: service.service_name,
          event_date: this.formatDate(service.created_at),
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
