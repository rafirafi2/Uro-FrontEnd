import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login_tawsif/login.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { RegisterDoctorComponent } from './register-doctor/register-doctor.component';
import { SignUpVerificationComponent } from './sign-up-verification/sign-up-verification.component';


const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterPatientComponent},
  {path:'registerDoctor',component:RegisterDoctorComponent},
  {path:'verify',component:SignUpVerificationComponent},
  {path:'verify/:email',component:SignUpVerificationComponent},
  {path:'',redirectTo:'/login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
