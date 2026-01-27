import { Component, Input } from '@angular/core';
import { Educacion } from 'src/app/models/education.model'; // Import Educacion

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {
  @Input() education: Educacion[] | undefined; // Now receives data via Input
}
