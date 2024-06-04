import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {parsePhoneNumberFromString, isPossiblePhoneNumber, parsePhoneNumber} from 'libphonenumber-js';
import { error } from 'console';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrl: './register-patient.component.css'
})
export class RegisterPatientComponent implements OnInit{


  signUpForm:FormGroup
  noMatch=true
  notValid=true

  ngOnInit(): void {
    this.signUpForm=new FormGroup(
      {
        first:new FormControl(null,Validators.required),
        last:new FormControl(null,Validators.required),
        email:new FormControl(null,Validators.required),
        countryCode:new FormControl(null, [Validators.required,Validators.required]),
        phoneNumber:new FormControl(null, [Validators.required,Validators.required]),
        password:new FormControl(null, [Validators.required,Validators.minLength(8)]),
        confirmPassword:new FormControl(null, [Validators.required,Validators.minLength(8)]),
      });
  }

  constructor(private authservice:AuthService,private router: Router){

  }

  validatePassword(password){

    if (password.length < 8) {
      return true;
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasLowerCase || !hasUpperCase) {
      return true;
    }

    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
      return true;
    }

    // Checksif password has one special character
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (!hasSpecialChar) {
      return true;
    }
  }

  matchPassword(password,confirm){
    if (password !== confirm) {
      return true;
    }
  }

  validateNumber(countryCode: any, phoneNumber: any){

    const full = parsePhoneNumberFromString(phoneNumber,countryCode);
    const check = parsePhoneNumber(phoneNumber,'US');
    const check2 = parsePhoneNumber(phoneNumber,'BD');

    if(countryCode==check.countryCallingCode){
      if(!isPossiblePhoneNumber(check.number)){
        console.log(countryCode+phoneNumber+" FALSE!")
        return false;
      }
      return check.number;
    }else if(countryCode==check2.countryCallingCode){

      if(!isPossiblePhoneNumber(check2.number)){
        console.log(countryCode+phoneNumber+" FALSE!")
        return false;
      }
      return check2.number;
    }
    return false;
  }


  validNumber = true;


  onSubmit(){

    const first = this.signUpForm.get('first').value;
    const last = this.signUpForm.get('last').value;
    const password = this.signUpForm.get('password').value;
    const confirm = this.signUpForm.get('confirmPassword').value;
    const email = this.signUpForm.get('email').value;
    const countryCode = this.signUpForm.get('countryCode').value;
    const phoneNumber = this.signUpForm.get('phoneNumber').value;

    const check = this.validateNumber(countryCode,phoneNumber);
    console.log(check)
    if(check==false){
      this.validNumber = false;
    }else{
      this.validNumber = true;
    }

    if(this.validatePassword(password)){
      this.notValid= false
      this.signUpForm.get('password').setErrors({"invalid":true})
    } else {
      this.notValid = true;
    }

    if(this.matchPassword(password,confirm)){
      this.noMatch = false;
      this.signUpForm.get('confirmPassword').setErrors({"invalid":true})
    } else {
      this.noMatch = true;
    }

    if(this.noMatch && this.validNumber && this.notValid){


      console.log("sign up user");
      const user ={
        "email":email,
        "username":email,
        "password":password,
        "phoneNumber":check,
        "first":first,
        "last":last,
      }
      this.authservice.createPatientUser(user).subscribe({
        next: (response)=>{
          console.log(response);
        },
        error: (error)=>console.log(error),
        complete: ()=>{
          console.log("COMPLETE")
          this.router.navigate(['/verify', email]);
          // MOVE TO VERIFICATION SCREEN WITH USER DETAILS -> USER ID in route
        }
    })

    }
    

    

  }

}
