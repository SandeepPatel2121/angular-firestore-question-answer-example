import { User } from './../../../model/User';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Question } from 'src/app/model/question';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/SharedService';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-AdminDashboard',
  templateUrl: './AdminDashboard.component.html',
  styleUrls: ['./AdminDashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public user: any;
  public isFormInvalid: boolean = false;
  public questions: Question[] = new Array();
  public users: User[] = new Array();

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private router: Router,
    private sharedService: SharedService) {
    if (this.sharedService.getUser() === 'ADMIN') {
      this.getAllQuestions();
      this.getAllUsers();
    } else {
      this.logout();
    }
  }

  ngOnInit() {
  }

  getAllQuestions() {
    this.firebaseService.getAllQuestions().subscribe(items => {
      this.questions = new Array();
      items.forEach((question) => {
        if (question.assignedAt) {
          question.assignedAt = this.commonService.toDateTime(question.assignedAt.seconds);
        }
        this.questions.push(question);
      });
    });
  }

  getAllUsers() {
    this.firebaseService.getAllUsers().subscribe(items => {
      this.users = items;
    });
  }

  onSubmit(question: Question) {
    if (this.user) {
      question.user = this.user;
      this.firebaseService.updateQuestion(question);
      // this.commonService.inCreamentUserQueue(this.user);
      this.user = '';
    } else {
      this.isFormInvalid = true;
    }
  }

  logout() {
    this.commonService.logout();
  }

}
