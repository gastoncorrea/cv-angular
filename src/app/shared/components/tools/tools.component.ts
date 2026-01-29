import { Component, Input } from '@angular/core';
import { Herramienta } from 'src/app/models/tools.model';
import { environment } from 'src/environments/environment'; // Import environment

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent {
  @Input() tools: Herramienta[] | undefined;
  backendUrl: string; // Declare backendUrl property

  constructor() {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  // Method to construct the full image URL
  getFullImageUrl(relativeUrl: string | null | undefined): string | undefined {
    if (relativeUrl && relativeUrl.trim() !== '') {
      // Check if the relativeUrl is already an absolute URL or a data URL
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
      }
      return `${this.backendUrl}${relativeUrl}`;
    }
    return undefined; // No valid logo URL, return undefined
  }
}
