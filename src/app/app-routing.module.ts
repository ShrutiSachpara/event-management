import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiceManageComponent } from './service-manage/service-manage.component';
import { ManageEventComponent } from './manage-event/manage-event.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'verifyEmail', component: ForgotPasswordComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'eventReport', component: ReportComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'serviceManage', component: ServiceManageComponent },
      { path: 'eventManage', component: ManageEventComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
