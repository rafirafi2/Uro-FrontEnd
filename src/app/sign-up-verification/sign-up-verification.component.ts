import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-sign-up-verification',
  templateUrl: './sign-up-verification.component.html',
  styleUrl: './sign-up-verification.component.css'
})
export class SignUpVerificationComponent implements OnInit {


  constructor(private router:Router,private activatedRoute:ActivatedRoute, private auth:AuthService){}


  ngOnInit() {
    
    this.email = this.activatedRoute.snapshot.paramMap.get('email');



  }

  email
  resendMessage
  code:string
  isResendDisabled = false;
  resendCountdown: number;


  onResendEmail(){

    if(this.isResendDisabled){
      return;
    }

    const verify = {
      "email":this.email
    }

    this.startResendCountdown(20);
    this.auth.resendEmail(verify).subscribe({
      next: (response)=>{
        this.resendMessage = "Verification Email Resent!"
      },
      error:(error)=>{
        console.log(error)
      }
    }
    )

  }

  startResendCountdown(countdown:number){
    this.isResendDisabled = true;
    this.resendCountdown  = countdown;
    const interval = setInterval(()=>{
      this.resendCountdown--;
      if(this.resendCountdown<=0){
        clearInterval(interval);
        this.isResendDisabled = false;
      }

    },1000)
  }


  validity = false;
  responseMessage
  onVerify(){

    console.log(this.code)
    console.log(this.email)

    const verify = {
      "email":this.email,
      "code":this.code
    }

    let valid = false;

    this.auth.verifyAccount(verify).subscribe({
      next: (response)=>{
        if(response==0){
          valid=true
        }
      
      },
      error: (error)=>console.log(error),
      complete: ()=>{
        
        if(valid){
        this.router.navigate(["/login"])
        }else{
          this.validity = true;
          this.responseMessage = "Incorrect Code"
        }
      }
    }
    )

  }

}
