import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { EducationComponent } from './components/education/education.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ToolsComponent } from './shared/components/tools/tools.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './pages/auth/login-form/login-form.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ResidenceDataComponent } from './components/residence-data/residence-data.component';
import { UserComponent } from './components/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonalDataComponent,
    ProjectsComponent,
    EducationComponent,
    ContactsComponent,
    SkillsComponent,
    ToolsComponent,
    HomeComponent,
    LoginFormComponent,
    UserComponent,
    ResidenceDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
