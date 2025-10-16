import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { EducationComponent } from './components/education/education.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ToolsComponent } from './shared/components/tools/tools.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonalDataComponent,
    ProjectsComponent,
    EducationComponent,
    ContactsComponent,
    SkillsComponent,
    ProjectDetailComponent,
    ToolsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
