import { Component } from '@angular/core';
import { ServiceManageService } from '../services/api/service-manage.service';
import { ENUM } from 'src/helper/enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import Swal from 'sweetalert2';
import { Messages } from 'src/helper/message';

@Component({
  selector: 'app-service-manage',
  templateUrl: './service-manage.component.html',
  styleUrls: ['./service-manage.component.css'],
})
export class ServiceManageComponent {
  listOfManageServiceData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 7;
  sortedColumn: string = 'order_id';
  isAscending: boolean = true;
  GetNewEvent!: FormGroup;
  searchEvent = '';
  isEditMode: boolean = false;
  selectedEventId: number | null = null;
  page: number = 1;
  isLoading: boolean = false;
  isDeleteConfirmationOpen: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  columns = ['id', 'service_name', 'price', 'created_at', 'action'];

  constructor(
    private serviceManageService: ServiceManageService,
    private toaster: ToasterService,
    private fb: FormBuilder
  ) {
    this.GetNewEvent = this.fb.group({
      event_manage_id: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      service_name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]*$/),
        ],
      ],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  close = ENUM.CLOSE;
  addEvent = ENUM.ADD_SERVICE;
  eventManageId = Messages.ID;
  eventManageIdType = Messages.NUM_VALID_Type;
  serviceName = Messages.SERVICE_NAME;
  serviceNameLength = Messages.SERVICE_NAME_LENGTH;
  serviceNameType = Messages.SERVICE_NAME_TYPE;
  priceReq = Messages.PRICE_REQ;

  ngOnInit() {
    this.listOfEvent();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
  }

  showMessage(message: string, action: string) {
    this.toaster.showMessage(message, action);
  }

  listOfEvent() {
    this.serviceManageService.getEventData().subscribe((response: any) => {
      if (response && response.status === 'success') {
        this.listOfManageServiceData = response.data;
        this.totalPages = Math.ceil(
          this.listOfManageServiceData.length / this.pageSize
        );
      } else {
        this.showMessage(response?.message || 'Error fetching data', 'dismiss');
      }
    });
  }

  getEvent(data: any) {
    this.serviceManageService
      .insertEventManageData(data)
      .subscribe((res: any) => {
        if (res && res.statusCode === 201) {
          alert(res.message);
          this.listOfEvent();
        }
      });
  }

  deleteList(id: number) {
    this.selectedEventId = id;
    this.isDeleteConfirmationOpen = true;
  }

  confirmDelete() {
    if (this.selectedEventId) {
      this.serviceManageService
        .deleteEvent(this.selectedEventId)
        .subscribe((result: any) => {
          if (result && result.statusCode == 200) {
            alert(result.message);
            this.listOfEvent();
            this.selectedEventId = null;
          }
        });
    }
    this.isDeleteConfirmationOpen = false;
  }

  private getSelectedEvent(id: number): any {
    return this.listOfManageServiceData.find((event) => event.id === id);
  }

  updateEvent(formData: any) {
    this.closeModal();
    if (this.selectedEventId) {
      this.serviceManageService
        .updateEvent(this.selectedEventId, formData)
        .subscribe((res: any) => {
          if (res && res.status === 'success') {
            alert(res.message);
            this.listOfEvent();
            this.isEditMode = false;
            this.GetNewEvent.reset();
            this.selectedEventId = null;
          }
        });
    }
  }

  editEvent(data: any) {
    const selectedEvent = this.getSelectedEvent(data.id);
    if (selectedEvent) {
      this.isEditMode = true;
      this.selectedEventId = data.id;
      this.GetNewEvent.patchValue(selectedEvent);
      this.openModal();
    }
  }

  deleteEvent(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceManageService.deleteEvent(data.id).subscribe((res: any) => {
          if (res && res.status === 'success') {
            Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
            this.listOfEvent();
            this.isEditMode = false;
            this.GetNewEvent.reset();
            this.selectedEventId = null;
          }
        });
      }
    });
  }

  openModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-modal', 'true');
      modalElement.style.display = 'block';
    }
  }

  closeModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.removeAttribute('aria-modal');
      modalElement.style.display = 'none';
    }
  }

  submitForm() {
    if (this.GetNewEvent.valid) {
      const formData = this.GetNewEvent.value;
      if (this.isEditMode) {
        this.updateEvent(formData);
      } else {
        this.getEvent(formData);
      }
    } else {
      console.log('Form is not valid. Please correct the errors.');
    }
  }
}
