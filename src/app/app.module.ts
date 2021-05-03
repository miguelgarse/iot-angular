import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/home/navbar/navbar.component';
import { RegisterComponent } from './components/home/administration/register/register.component';
import { LeafletMapComponent } from './components/home/leaflet-map/leaflet-map.component';
import { MyProjectsComponent } from './components/home/my-projects/my-projects.component';
import { PrincipalComponent } from './components/home/principal/principal.component';
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
import { FooterComponent } from './components/home/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    PrincipalComponent,
    ProjectsComponent,
    MyProjectsComponent,
    FormProjectComponent,
    LeafletMapComponent,
    FooterComponent
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
    NgxSpinnerModule
  ],
  providers: [
    interceptorProvider,
    globalErrorHandlerProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
