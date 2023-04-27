import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenService } from '../../services/api/auth/token.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tokenService.get() != null) {
      this.tokenService.isValid(this.tokenService.get()).subscribe(
        (data) => {
          console.log('[panel] Login Successful: ' + data.data?.isValid);
        },
        (err) => {
          console.log('[panel] Login Error');
          this.tokenService.remove();
          this.router.navigate(['']);
        }
      )
    } else {
      console.log('[panel] TokenNotFound');
      this.router.navigate(['']);
    }
  }

}
