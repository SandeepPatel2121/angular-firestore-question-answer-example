import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/model/question';
import { User } from 'src/app/model/User';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/SharedService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public questionForm: FormGroup;
  public user: any;
  public questions: Question;
  public users: User[] = new Array();

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private router: Router,
    private sharedService: SharedService) {
    if (this.sharedService.getUser() === 'ADMIN') {
      this.getAllUsers();
    } else {
      this.logout();
    }
  }

  ngOnInit() {
    this.initForm();
  }

  getAllUsers() {
    this.firebaseService.getAllUsers().subscribe(items => {
      this.users = items;
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      this.firebaseService.addQuestion(this.questionForm.value);
      if (this.questionForm.get('user').value) {
        // this.commonService.inCreamentUserQueue(this.questionForm.get('user').value);
      }
      this.router.navigate(['admin']);
    } else {
      this.commonService.markFormGroupTouched(this.questionForm);
      this.fetchAllValidations(this.questionForm);
    }
  }

  initForm() {
    this.questionForm = this.formBuilder.group({
      question: ["", [Validators.required]],
      isAnswered: [false, [Validators.required]],
      user: [""],
    });
  }

  formErrors = {
    question: '',
    user: ''
  }

  ValidationMessages = {
    'question': {
      'required': 'Please enter question.',
    },
    'user': {
      'required': 'Please select user.',
    },
  }

  loadValidationError() {
    this.fetchAllValidations(this.questionForm);
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
