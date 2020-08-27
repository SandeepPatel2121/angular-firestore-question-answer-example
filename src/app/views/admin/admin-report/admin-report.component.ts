import { CommonService } from 'src/app/services/common.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Question } from 'src/app/model/question';
import { SharedService } from 'src/app/services/SharedService';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as Filter from 'bad-words';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css']
})
export class AdminReportComponent implements OnInit {

  public type: string = "CREATED_AT";
  public start: Date;
  public end: Date;
  public questions: Question[] = new Array();

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private sharedService: SharedService,
    private router: Router) { this.setDate() }

  ngOnInit() {
    this.getReport();
  }

  getReport() {
    var customFilter = new Filter({ placeHolder: 'x' });

    if (this.type == "ANSWERED_AT") {
      this.firebaseService.getAnswerReport(this.start, this.end).subscribe(items => {
        this.questions = new Array();
        items.forEach((question) => {
          let q = customFilter.clean(question.question);
          if (q.includes("xxxx")) {
            question.hasAbusiveWord = true;
          }
          if (question.assignedAt) {
            question.assignedAt = this.commonService.toDateTime(question.assignedAt.seconds);
          }
          if (question.anweredAt) {
            question.anweredAt = this.commonService.toDateTime(question.anweredAt.seconds);
          }
          question.question = q;
          this.questions.push(question);
        });
      });
    } else if (this.type == "IS_ABUSIVE") {
      this.firebaseService.getHasAbusive(this.start, this.end).subscribe(items => {
        this.questions = new Array();
        items.forEach((question) => {
          let q = customFilter.clean(question.question);
          if (q.includes("xxxx")) {
            question.hasAbusiveWord = true;
          }
          if (question.assignedAt) {
            question.assignedAt = this.commonService.toDateTime(question.assignedAt.seconds);
          }
          if (question.anweredAt) {
            question.anweredAt = this.commonService.toDateTime(question.anweredAt.seconds);
          }
          question.question = q;
          this.questions.push(question);
        });
      });
    } else {
      this.firebaseService.getCreatedReport(this.start, this.end).subscribe(items => {
        this.questions = new Array();
        items.forEach((question) => {
          let q = customFilter.clean(question.question);
          if (q.includes("xxxx")) {
            question.hasAbusiveWord = true;
          }
          if (question.assignedAt) {
            question.assignedAt = this.commonService.toDateTime(question.assignedAt.seconds);
          }
          if (question.anweredAt) {
            question.anweredAt = this.commonService.toDateTime(question.anweredAt.seconds);
          }
          question.question = q;
          this.questions.push(question);
        });
      });
    }
  }

  exportExcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "admin-report.xlsx");
  }

  setDate() {
    let temp: Date = new Date();
    this.end = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
    this.start = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate() - 10);
  }

  getDate(date) {
    this.start = new Date(date.startDate);
    this.end = new Date(date.endDate);
    this.getReport();
  }

  

  logout() {
    this.commonService.logout();
  }

}
