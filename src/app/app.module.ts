import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FirebaseService } from './services/firebase.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { SharedService } from './services/SharedService';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { CommonService } from './services/common.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'angularfs'),
    AngularFirestoreModule,
  ],
  providers: [FirebaseService, SharedService, CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
