  import { Component, OnInit } from '@angular/core';
  import { ToasterService } from '../services/toaster.service';
  import { ManageEventService } from '../services/api/manage-event.service';
  import { ENUM } from 'src/helper/enum';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import Swal from 'sweetalert2';
  import { Messages } from 'src/helper/message';

  @Component({
    selector: 'app-manage-event',
    templateUrl: './manage-event.component.html',
    styleUrls: ['./manage-event.component.css'],
  })
  export class ManageEventComponent implements OnInit {
    GetNewEvent!: FormGroup;
    listOfEventData: any[] = [];
    currentPage: number = 1;
    totalPages: number = 1;
    pageSize: number = 7;
    sortedColumn: string = 'order_id';
    isAscending: boolean = true;
    searchEvent = '';
    isEditMode: boolean = false;
    selectedEventId: number | null = null;
    page: number = 1;
    isLoading: boolean = false;
    isDeleteConfirmationOpen: boolean = false;
    showAlert: boolean = false;
    alertMessage: string = '';
    columns = ['id', 'event_name', 'created_at', 'action'];

    constructor(
      private manageEventService: ManageEventService,
      private toaster: ToasterService,
      private fb: FormBuilder
    ) {
      this.GetNewEvent = this.fb.group({
        event_name: ['', [Validators.required, Validators.maxLength(50)]],
      });
    }

    addEvent = ENUM.ADD_EVENT;
    close = ENUM.CLOSE;
    nameMessage = Messages.EVENT_NAME;
    lengthMessage = Messages.EVENT_NAME_LENGTH;

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
      this.manageEventService.getEventData().subscribe((response: any) => {
        if (response && response.status === 'success') {
          this.listOfEventData = response.data;
          this.totalPages = Math.ceil(
            this.listOfEventData.length / this.pageSize
          );
        } else {
          this.showMessage(response?.message || 'Error fetching data', 'dismiss');
        }
      });
    }

    getEvent(data: any) {
      this.manageEventService
        .insertEventManageData(data)
        .subscribe((res: any) => {
          if (res && res.statusCode === 201) {
            alert(res.message);
            this.listOfEvent();
          }
        });
    }

    updateEvent(formData: any) {
      this.closeModal();
      if (this.selectedEventId) {
        this.manageEventService
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

    private getSelectedEvent(id: number): any {
      return this.listOfEventData.find((event) => event.id === id);
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
          this.manageEventService.deleteEvent(data.id).subscribe((res: any) => {
            debugger;
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
