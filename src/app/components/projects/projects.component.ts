import { Component, Input } from '@angular/core';
import { Proyecto } from 'src/app/models/project.model'; // Import Proyecto

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  @Input() projects: Proyecto[] | undefined; // Now receives data via Input
}
