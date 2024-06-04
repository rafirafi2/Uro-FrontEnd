import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  private signUpPatientURL = environment.url+"register/patient";
  private signUpDoctorURL = environment.url+"register/doctor";
  private resendEmailURL = environment.url+"register/resend";
  private verifyEmailURL = environment.url+"register/validate";//"/validate/{code}/{email}"
  private loginURL = environment.url+"login";

  createPatientUser(user){
    return this.http.post<any>(this.signUpPatientURL,user,{responseType: 'text' as any});
  }

  createDOctorUser(user){
    return this.http.post<any>(this.signUpDoctorURL,user,{responseType: 'text' as any});
  }

  resendEmail(verification){
    return this.http.post<any>(this.resendEmailURL,verification);
  }

  verifyAccount(verification){
    return this.http.post<any>(this.verifyEmailURL,verification);
  }

  login(username, password){

    const authorizationHeader = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders().set('Authorization', authorizationHeader);
    return this.http.post<any>(this.loginURL, null, {headers});

  }

  saveToken(token:string){
    localStorage.setItem('Bearer Token',token)
  }

  getToken(){
    return localStorage.getItem('Bearer Token');
  }

  removeToken(){
    localStorage.removeItem('Bearer Token');
  }

}
