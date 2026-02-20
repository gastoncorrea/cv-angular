import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Herramienta } from 'src/app/models/tools.model';
import { environment } from 'src/environments/environment'; // Import environment
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent {
  @Input() tools: Herramienta[] | undefined;
  @Output() edit = new EventEmitter<Herramienta>();
  @Output() delete = new EventEmitter<Herramienta>();
  
  backendUrl: string; // Declare backendUrl property

  constructor(public authService: AuthService) {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  // Method to construct the full image URL
  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl && relativeUrl.trim() !== '') {
      // Check if the relativeUrl is already an absolute URL or a data URL
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
      }
      return `${this.backendUrl}${relativeUrl}`;
    }
    return 'assets/img/icono-de-herramienta-logo.webp'; // Return default image if no valid logo URL
  }

  onEditTool(tool: Herramienta): void {
    this.edit.emit(tool);
  }

  onDeleteTool(tool: Herramienta): void {
    if (confirm(`¿Estás seguro de que quieres quitar la herramienta "${tool.nombre}"?`)) {
      this.delete.emit(tool);
    }
  }
}
