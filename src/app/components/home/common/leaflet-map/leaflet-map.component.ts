import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { Project } from 'src/app/models/Project';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements AfterViewInit {

  @Input() projectList: Project[] = [];

  private map: any;

  private initMap(): void {

    // Map centered in the Campus Sur UPM (Madrid)
    this.map = L.map('map', {
      center: [ 40.3895, -3.6270 ],
      zoom: 6
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.projectList.forEach(project => {
      let sensorIcon = L.icon({
        iconUrl: '../../../../../../assets/sensor_marker.png',
    
        iconSize:     [40, 50], // size of the icon
        iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
      });
  
      let marker = L.marker([project.latitude, project.longitude], {icon: sensorIcon}).addTo(this.map);
      marker.bindPopup("<b>" + project.title + "</b><br>Valor actual: 27º C");
    });
  }
  
  constructor() { }

  ngAfterViewInit(): void { 
    this.initMap();
  }

}
