import { StudentEntryModalComponent } from './components/student-entry-modal/student-entry-modal.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'student-list', component: StudentListComponent, canActivate: [AuthGuard] },
  { path: 'student-detail', component: StudentDetailComponent, canActivate: [AuthGuard] },
  { path: 'student-entry', component: StudentEntryModalComponent, canActivate: [AuthGuard] },
  { path: '**', component: LandingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
