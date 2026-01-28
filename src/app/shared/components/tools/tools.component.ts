import { Component, Input } from '@angular/core';
import { Herramienta } from 'src/app/models/tools.model';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent {
  @Input() tools: Herramienta[] | undefined;
}
