import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/home/common/navbar/navbar.component';
import { RegisterComponent } from './components/home/administration/register/register.component';
import { FormProjectComponent } from './components/home/projects/form-project/form-project.component';
import { ProjectsComponent } from './components/home/projects/projects.component';
import { LoginComponent } from './components/login/login.component';
import { interceptorProvider } from './interceptors/prod-interceptor.service';
import { globalErrorHandlerProvider } from './handler/global-error-handler.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxSpinnerModule } from "ngx-spinner";
import { FooterComponent } from './components/home/common/footer/footer.component';
import { SensorsComponent } from './components/home/administration/sensors/sensors.component';
import { UserProfileComponent } from './components/home/user-profile/user-profile.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ConfirmDialogComponent } from './components/home/common/confirm-dialog/confirm-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NewImageDialogComponent } from './components/home/user-profile/new-image-dialog/new-image-dialog.component';
import { UserDataDialogComponent } from './components/home/administration/register/user-data-dialog/user-data-dialog.component';
import { ChangePasswordDialogComponent } from './components/login/change-password-dialog/change-password-dialog.component';
import { SensorSelectionDialogComponent } from './components/home/projects/form-project/sensor-selection-dialog/sensor-selection-dialog.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProjectsComponent,
    FormProjectComponent,
    FooterComponent,
    SensorsComponent,
    UserProfileComponent,
    ConfirmDialogComponent,
    NewImageDialogComponent,
    UserDataDialogComponent,
    ChangePasswordDialogComponent,
    SensorSelectionDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
    }),
    ZXingScannerModule,
    NgxSpinnerModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }), 
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [
    interceptorProvider,
    globalErrorHandlerProvider, 
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
