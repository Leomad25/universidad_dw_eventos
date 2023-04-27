import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { LoginService } from '../../services/api/auth/auth.service';
import { TokenService } from '../../services/api/auth/token.service';
import { LoginRequest } from '../../models/auth.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loadingScreenActive:boolean = false;
  errorScreenActive:boolean = false;
  errorScreenMessage:string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.tokenService.get() != null) {
      this.tokenService.isValid(this.tokenService.get()).subscribe(
        (data) => {
          console.log('[auth/login] Token Valid');
          this.router.navigate(['panel']);
        },
        (err) => {
          console.log('[auth/login] Token Invalid');
          this.tokenService.remove();
        }
      )
    }
  }

  onLoginClick() {
    this.loadingScreenActive = true;
    if (this.form.valid) {
      const body:LoginRequest = {
        nickname: this.form.controls['username'].value,
        password: this.form.controls['password'].value
      }
      this.loginService.sendLogin(body)
        .subscribe((data) => {
          if (data.responsive.code > 0) {
            this.loginSuccess(data.data);
          } else {
            this.errorScreenActive = true;
            this.errorScreenMessage = 'Err: Unknow err';
          }
        }, (err: HttpErrorResponse) => {
          const message:string|undefined = err.error.responsive?.message;
          this.errorScreenActive = true;
          if (message != undefined) {
            this.loadingScreenActive = false;
            this.errorScreenMessage = message;
          } else {
            this.loadingScreenActive = false;
            this.errorScreenMessage = 'Err: Unknow err';
          }
        });
    }
  }

  onCloseErrScreen() {
    this.errorScreenActive = false;
    this.errorScreenMessage = '';
  }

  private loginSuccess(data: any) {
    this.tokenService.save(data.jwt);
    this.router.navigate(['panel']);
  }
}
