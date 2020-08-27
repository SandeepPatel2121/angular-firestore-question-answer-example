import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { SharedService } from './SharedService';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private sharedService: SharedService
    ) { }

  inCreamentUserQueue(user: string) {
    if (user) {
      this.firebaseService.getUserById(user).subscribe(user => {
        if (user && user.length > 0) {
          this.firebaseService.inCreamentUserQueue(user[0]);
        }
      })
    }
  }

  deCreamentUserQueue(user: string) {
    if (user) {
      this.firebaseService.getUserById(user).subscribe(user => {
        if (user && user.length > 0) {
          this.firebaseService.deCreamentUserQueue(user[0]);
        }
      })
    }
  }

  logout() {
    this.sharedService.setUser('');
    this.router.navigate(['']);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  toDateTime(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t;
  }

}
