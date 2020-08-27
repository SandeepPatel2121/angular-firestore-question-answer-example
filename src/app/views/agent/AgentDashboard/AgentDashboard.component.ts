import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Question } from 'src/app/model/question';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/SharedService';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-AgentDashboard',
  templateUrl: './AgentDashboard.component.html',
  styleUrls: ['./AgentDashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {

  public user: any;
  public date: any;
  public questionForm: FormGroup;
  public questions: Question[] = new Array();
  public users: string[] = new Array();
  public currentQuestion: Question;
  public previousQuestion: Question;

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService) {
    this.getAllUsers();
  }

  ngOnInit() {
    this.initForm();
  }

  getQuestions() {
    this.firebaseService.getQuestions(this.user).subscribe(items => {
      if (items.length && items.length > 0) {
        this.questions = new Array();
        items.forEach((question) => {
          if (question.assignedAt) {
            question.assignedAt = this.commonService.toDateTime(question.assignedAt.seconds);
          }
          this.questions.push(question);
        });
        this.currentQuestion = this.questions[0];
        this.questions.shift();
        this.setValue(this.currentQuestion);
      }
    });
  }

  onQuestionSelect(question, index) {
    this.previousQuestion = this.currentQuestion;
    this.questions[index] = this.previousQuestion;
    this.currentQuestion = question;
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
    if (this.questionForm.valid) {
      this.currentQuestion.answer = this.questionForm.get("answer").value
      this.currentQuestion.isAnswered = true;
      this.firebaseService.updateQuestion(this.currentQuestion);
      // this.commonService.deCreamentUserQueue(this.currentQuestion.user);
      this.currentQuestion = null;
      this.questionForm.reset();
    } else {
      this.commonService.markFormGroupTouched(this.questionForm);
      this.fetchAllValidations(this.questionForm);
    }
  }

  setValue(currentQuestion: Question) {
    this.questionForm.patchValue({
      id: currentQuestion.id,
    })
  }

  checkLogin() {
    if (this.users.includes(this.sharedService.getUser())) {
      this.user = this.sharedService.getUser();
      this.getQuestions();
    } else {
      this.logout()
    }
  }

  logout() {
    this.commonService.logout();
  }

  initForm() {
    this.questionForm = this.formBuilder.group({
      id: ["", [Validators.required]],
      answer: ["", [Validators.required]],
    });
  }

  formErrors = {
    id: '',
    answer: '',
  }

  ValidationMessages = {
    'id': {
      'required': 'Question id is undefined.',
    },
    'answer': {
      'required': 'Please enter answer for this question.',
    }
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

}
