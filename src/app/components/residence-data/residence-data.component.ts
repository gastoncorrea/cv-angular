import { Component, Input } from '@angular/core';
import { Residencia } from 'src/app/models/residence.model';

@Component({
  selector: 'app-residence-data',
  templateUrl: './residence-data.component.html',
  styleUrls: ['./residence-data.component.css']
})
export class ResidenceDataComponent {
  @Input() residences: Residencia[] | undefined;
}