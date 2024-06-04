import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm:FormGroup

  constructor(private auth:AuthService,private router:Router){}

  ngOnInit() {
    this.loginForm=new FormGroup(
      {
        email:new FormControl(null,Validators.required),
        password:new FormControl(null, [Validators.required,Validators.minLength(8)]),
      });
  }


  
  onSubmit(){

    const pass = this.loginForm.get('password').value;
    const email = this.loginForm.get('email').value;

    let validated = false;
    this.auth.login(email,pass).subscribe(
      {
        next:(response)=>{
          console.log(response)
          validated = true;
          this.auth.saveToken(response);
        },
        error:(error)=>{
          console.log(error)
        },
        complete:()=>{
          if(validated){
            this.router.navigate(["/homepage"])//doesnt exist yet
          }
        }
      }
    )

    

  }

}
