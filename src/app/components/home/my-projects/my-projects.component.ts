import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  public qrResultString: string = "";
  public fileList: File[] = [];

  constructor(private projectsServices: ProjectsService) { }

  ngOnInit() {
  }

  public  handleQrCodeResult(resultString: string) {
    this.qrResultString = resultString;

  } 

  fileChange(event: any) {
    if(event.target.files != null && event.target.files.length > 0){
      let fileSize: number = event.target.files[0].size;

      this.fileList.push(event.target.files[0]);

      event.target.value = '';  //Vaciamos el array en el que nos vienen los ficheros que hemos seleccionado con el input
    }
  }

  uploadFiles(){
    this.projectsServices.uploadFiles(this.fileList[0]).subscribe(response => {

    }, error => {
      console.error('Se ha producido un error. ' + error);
    });
  }


}
