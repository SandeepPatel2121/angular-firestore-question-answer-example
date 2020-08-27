import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AdminDashboardComponent } from './views/admin/AdminDashboard/AdminDashboard.component';
import { AgentDashboardComponent } from './views/agent/AgentDashboard/AgentDashboard.component';
import { AdminUsersComponent } from './views/admin/Users/Users.component';
import { AddUserComponent } from './views/admin/add-user/add-user.component';
import { QuestionComponent } from './views/admin/question/question.component';
import { HistoryComponent } from './views/agent/history/history.component';
import { AdminReportComponent } from './views/admin/admin-report/admin-report.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
    },
    {
        path: 'admin/users',
        component: AdminUsersComponent,
    },
    {
        path: 'admin/user',
        component: AddUserComponent,
    },
    {
        path: 'admin/question',
        component: QuestionComponent,
    },
    {
        path: 'admin/report',
        component: AdminReportComponent,
    },
    {
        path: 'user',
        component: AgentDashboardComponent,
    },
    {
        path: 'user/history',
        component: HistoryComponent,
    }
];

@NgModule({
    declarations: [ 
        LoginComponent,
        AdminDashboardComponent,
        AgentDashboardComponent,
        AdminUsersComponent,
        AddUserComponent,
        QuestionComponent,
        HistoryComponent,
        AdminReportComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        DateRangePickerModule,
        RouterModule.forRoot(routes),
    ],
    exports: [
        BrowserModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: []
})
export class AppRoutingModule { }
