import { User } from './../../../model/User';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/SharedService';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-AdminUser',
  templateUrl: './Users.component.html',
  styleUrls: ['./Users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  public user: any;
  public isFormInvalid: boolean = false;
  public users: User[] = new Array();

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private router: Router,
    private sharedService: SharedService) {
    if (this.sharedService.getUser() === 'ADMIN') {
      this.getAllUsers()
    } else {
      this.logout();
    }
  }

  ngOnInit() {
  }

  getAllUsers() {
    this.firebaseService.getAllUsers().subscribe(items => {
      this.users = items;
    });
  }

  logout() {
    this.commonService.logout();
  }

}
