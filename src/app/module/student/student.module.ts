import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ChildComponent } from './components/child/child.component';


@NgModule({
  declarations: [
    HomeComponent,
    ChildComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
