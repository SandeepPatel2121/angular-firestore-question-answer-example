import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../services/SharedService';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public users: string[] = new Array();
  public loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private firebaseService: FirebaseService) { this.getAllUsers() }

  ngOnInit() {
    this.initForm();
  }

  getAllUsers() {
    this.firebaseService.getAllUsers().subscribe(items => {
      items.forEach((user) => {
        this.users.push(user.code);
      })
      this.checkLogin();
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      if (this.users.includes(this.loginForm.get('user').value)) {
        this.sharedService.setUser(this.loginForm.get('user').value);
        this.router.navigate(['user']);
      } else if (this.loginForm.get('user').value == 'ADMIN') {
        this.sharedService.setUser('ADMIN');
        this.router.navigate(['admin']);
      } else {
        alert("Please enter valid credentials");
      }
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.fetchAllValidations(this.loginForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      user: ["", [Validators.required]],
    });
  }

  formErrors = {
    user: ''
  }

  ValidationMessages = {
    'user': {
      'required': 'Please enter employee code.',
    }
  }

  loadValidationError() {
    this.fetchAllValidations(this.loginForm);
  }

  fetchAllValidations(group: FormGroup) {
    Object.keys(group.controls).forEach((key) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl instanceof FormGroup) {
        this.fetchAllValidations(abstractControl);
      } else {
        if (abstractControl && abstractControl.invalid && abstractControl.touched) {
          const msg = this.ValidationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += msg[errorKey] + ' ';
            }
          }
        }
      }
    });
    console.log(this.formErrors);
  }

  checkLogin() {
    if (this.users.includes(this.sharedService.getUser())) {
      this.router.navigate(['user']);
    } else if (this.sharedService.getUser() === 'ADMIN') {
      this.router.navigate(['admin']);
    } else {
      this.initForm();
    }
  }

}
