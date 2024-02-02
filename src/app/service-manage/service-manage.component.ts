import { Component } from '@angular/core';
import { ServiceManageService } from '../services/api/service-manage.service';
import { ENUM } from 'src/helper/enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import { Messages } from 'src/helper/message';
import { SweetAlertService } from '../services/sweet-alert.service';
import { ManageServiceData } from '../data-type';

@Component({
  selector: 'app-service-manage',
  templateUrl: './service-manage.component.html',
  styleUrls: ['./service-manage.component.css'],
})
export class ServiceManageComponent {
  listOfManageServiceData: ManageServiceData[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 7;
  sortedColumn: string = 'order_id';
  isAscending: boolean = true;
  serviceForm!: FormGroup;
  searchEvent = '';
  isEditMode: boolean = false;
  selectedServiceId: number | null = null;
  page: number = 1;
  isLoading: boolean = false;
  isDeleteConfirmationOpen: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  columns = ['Sr. No', 'service_name', 'price', 'created_at', 'action'];

  constructor(
    private serviceManageService: ServiceManageService,
    private toaster: ToasterService,
    private fb: FormBuilder,
    private sweetAlertService: SweetAlertService
  ) {
    this.serviceForm = this.fb.group({
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
  addService = ENUM.ADD_SERVICE;
  serviceId = Messages.ID;
  serviceIdType = Messages.NUM_VALID_Type;
  serviceName = Messages.SERVICE_NAME;
  serviceNameLength = Messages.SERVICE_NAME_LENGTH;
  serviceNameType = Messages.SERVICE_NAME_TYPE;
  priceReq = Messages.PRICE_REQ;

  ngOnInit() {
    this.listOfService();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
  }

  showMessage(message: string, action: string) {
    this.toaster.showMessage(message, action);
  }

  listOfService() {
    this.serviceManageService.getServiceData().subscribe((response: any) => {
      if (response && response.status === ENUM.SUCCESS) {
        this.listOfManageServiceData = response.data;
        this.totalPages = Math.ceil(
          this.listOfManageServiceData.length / this.pageSize
        );
      } else {
        this.showMessage(response?.message || 'Error fetching data', 'dismiss');
      }
    });
  }

  getService(data: any) {
    this.serviceManageService
      .insertManageServiceData(data)
      .subscribe((res: any) => {
        if (res && res.statusCode === 201) {
          alert(res.message);
          this.listOfService();
        }
      });
  }

  deleteList(id: number) {
    this.selectedServiceId = id;
    this.isDeleteConfirmationOpen = true;
  }

  confirmDelete() {
    if (this.selectedServiceId) {
      this.serviceManageService
        .deleteEvent(this.selectedServiceId)
        .subscribe((result: any) => {
          if (result && result.statusCode == 200) {
            alert(result.message);
            this.listOfService();
            this.selectedServiceId = null;
          }
        });
    }
    this.isDeleteConfirmationOpen = false;
  }

  private getSelectedEvent(id: number): any {
    return this.listOfManageServiceData.find((event) => event.id === id);
  }

  updateService(formData: any) {
    this.closeModal();
    if (this.selectedServiceId) {
      this.serviceManageService
        .updateService(this.selectedServiceId, formData)
        .subscribe((res: any) => {
          if (res && res.status === ENUM.SUCCESS) {
            alert(res.message);
            this.listOfService();
            this.isEditMode = false;
            this.serviceForm.reset();
            this.selectedServiceId = null;
          }
        });
    }
  }

  editEvent(data: any) {
    const selectedEvent = this.getSelectedEvent(data.id);
    if (selectedEvent) {
      this.isEditMode = true;
      this.selectedServiceId = data.id;
      this.serviceForm.patchValue(selectedEvent);
      this.openModal();
    }
  }

  deleteEvent(data: any) {
    this.sweetAlertService
      .confirmDialog('Are you sure?', 'This action cannot be undone.')
      .then((confirmed) => {
        if (confirmed) {
          this.serviceManageService
            .deleteEvent(data.id)
            .subscribe((res: any) => {
              if (res && res.status === ENUM.SUCCESS) {
                this.showMessage(
                  'Your service has been deleted successfully.',
                  ENUM.SUCCESS
                );
                this.listOfService();
                this.isEditMode = false;
                this.serviceForm.reset();
                this.selectedServiceId = null;
              } else {
                this.showMessage('Failed to delete the service.', ENUM.DISMISS);
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
    if (this.serviceForm.valid) {
      const formData = this.serviceForm.value;
      if (this.isEditMode) {
        this.updateService(formData);
      } else {
        this.getService(formData);
      }
    } else {
      this.showMessage(
        'Form is not valid. Please correct the errors.',
        'dismiss'
      );
    }
  }
}
