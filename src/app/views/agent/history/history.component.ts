import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/model/question';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/SharedService';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  public user: any;
  public questions: Question[];
  public users: string[] = new Array();
  public currentQuestion: Question;

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private router: Router,
    private sharedService: SharedService) { this.checkLogin(); }

  ngOnInit() {
  }

  checkLogin() {
    if (this.sharedService.getUser()) {
      this.user = this.sharedService.getUser();
      this.getUserHistory();
    } else {
      this.logout()
    }
  }

  getUserHistory() {
    this.questions = new Array();
    this.firebaseService.getUserHistory(this.sharedService.getUser()).subscribe(items => {
      this.questions = new Array();
      items.forEach((question) => {
        if (question.assignedAt) {
          question.assignedAt = this.commonService.toDateTime(question.assignedAt.seconds);
        }
        if (question.anweredAt) {
          question.anweredAt = this.commonService.toDateTime(question.anweredAt.seconds);
        }
        this.questions.push(question);
      });
    });
  }

  logout() {
    this.commonService.logout();
  }

}
