import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SharedService } from 'src/app/services/SharedService';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  public userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private router: Router,
    private sharedService: SharedService
  ) {
    if (this.sharedService.getUser() !== 'ADMIN') {
      this.logout();
    }
  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.firebaseService.addUser(this.userForm.value);
      this.router.navigate(['admin/users']);
    } else {
      this.commonService.markFormGroupTouched(this.userForm);
      this.fetchAllValidations(this.userForm);
    }
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      code: ["", [Validators.required]],
      queueSize: [0, ""],
    });
  }

  formErrors = {
    name: '',
    code: ''
  }

  ValidationMessages = {
    'name': {
      'required': 'Please enter agent name.',
    },
    'code': {
      'required': 'Please enter agent code.',
    },
  }

  loadValidationError() {
    this.fetchAllValidations(this.userForm);
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

  logout() {
    this.commonService.logout();
  }

}
