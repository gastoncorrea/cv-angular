import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRefreshService {
  private refreshSkillsSource = new Subject<void>();
  
  // Observable stream for components to listen to
  refreshSkills$ = this.refreshSkillsSource.asObservable();

  // Method to trigger the refresh
  triggerSkillsRefresh(): void {
    this.refreshSkillsSource.next();
  }
}
