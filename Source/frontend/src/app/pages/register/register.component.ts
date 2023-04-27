import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { RegisterService } from '../../services/api/auth/auth.service'
import { TokenService } from '../../services/api/auth/token.service';
import { RegisterRequest } from '../../models/auth.model';

import { CustomValidators } from '../../auxiliary/customValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isBtnRegisterDisabled:boolean = true;
  loadingScreenActive:boolean = false;
  errorScreenActive:boolean = false;
  errorScreenMessage:string[] = [];
  successScreenActive:boolean = false;
  successScreenMessage:string[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      document: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required, CustomValidators.MatchPassword]]
    });
  }

  ngOnInit(): void {
    if (this.tokenService.get() != null) {
      this.tokenService.isValid(this.tokenService.get()).subscribe(
        (data) => {
          console.log('[auth/register] Token Valid');
          this.router.navigate(['panel']);
        },
        (err) => {
          console.log('[auth/register] Token Invalid');
          this.tokenService.remove();
        }
      )
    }
  }

  onLoginClick() {
    this.loadingScreenActive = true;
    if (this.form.valid) {
      const body:RegisterRequest = {
        document: this.form.controls['document'].value,
        name: this.form.controls['fullname'].value,
        nickname: this.form.controls['username'].value,
        password: this.form.controls['password'].value
      }
      this.registerService.sendRegister(body)
        .subscribe((data) => {
          if (data.responsive.code > 0) {
            this.loadingScreenActive = false;
            this.registerSuccess(data.data);
          } else {
            this.loadingScreenActive = false;
            this.errorScreenActive = true;
            this.errorScreenMessage = ['Err: Unknow err'];
          }
        }, (err: HttpErrorResponse) => {
          const message:string|undefined = err.error.responsive?.message;
          this.errorScreenActive = true;
          if (message != undefined) {
            this.loadingScreenActive = false;
            this.errorScreenMessage = [];
          } else {
            this.loadingScreenActive = false;
            this.errorScreenMessage = ['Err: Unknow err'];
          }
        });
    }
  }

  onCloseErrScreen() {
    this.errorScreenActive = false;
    this.errorScreenMessage = [];
  }
  
  private registerSuccess(data: any) {
    this.successScreenActive = true;
    let roleMessage:string = 'Failed role assignment, contact an administrator';
    if (data.role) roleMessage = 'Role assigned successfully';
    this.successScreenMessage = ['Account created successfully', roleMessage, 'Close for continue to login'];
  }

  onCloseSuccessAlert() {
    this.router.navigate(['auth/login']);
  }
}
