import { User } from './../model/User';
import { Question } from './../model/question';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  items: Observable<Question[]>;
  itemDoc: AngularFirestoreDocument<Question>;
  users: Observable<User[]>;
  usersDoc: AngularFirestoreDocument<User>;

  constructor(private firestore: AngularFirestore) { }

  // Created Date DESC
  getQuestions(user: any): any {
    return this.firestore.collection('questions', ref => ref.where("isAnswered", "==", false).where('user', '==', user).orderBy('assignedAt', 'desc')).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Question;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  getQuestions2(user: any): any {
    return this.firestore.collection('questions', ref => ref.where("isAnswered", "==", false).where('user', '==', user)).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Question;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  getUserHistory(user: string) {
    return this.firestore.collection('questions', ref => ref.where("isAnswered", "==", true).where('user', '==', user).orderBy('anweredAt', 'desc')).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Question;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  getAllQuestions() {
    return this.firestore.collection('questions', ref => ref.where("isAnswered", "==", false).orderBy('assignedAt', 'desc')).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Question;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  getAnswerReport(start: Date, end: Date) {
    return this.firestore.collection('questions', ref => ref.where("anweredAt", ">=", start).where("anweredAt", "<=", end)).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Question;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  getCreatedReport(start: Date, end: Date) {
    return this.firestore.collection('questions', ref => ref.where("assignedAt", ">=", start).where("assignedAt", "<=", end)).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Question;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  getHasAbusive(start: Date, end: Date) {
    return this.firestore.collection('questions', ref => ref.where("hasAbusiveWord", "==", true).orderBy('assignedAt', 'desc')).snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Question;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  getAllUsers() {
    return this.firestore.collection('users').snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as User;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  addQuestion(question: any) {
    question['assignedAt'] = new Date();
    this.firestore.collection('questions').add(question);
  }

  getUserById(code) {
    return this.firestore.collection('users', ref => ref.where("code", "==", code)).snapshotChanges()
    .pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }

  addUser(data: any) {
    this.firestore.collection('users').add(data);
  }

  updateQuestion(question: Question) {
    question['anweredAt'] = new Date();
    question['assignedBy'] = 'ADMIN';
    question['asignedType'] = 'MANUAL';
    this.itemDoc = this.firestore.doc(`questions/${question.id}`);
    this.itemDoc.update(question);
  }

  inCreamentUserQueue(user: User) {
    user.queueSize += 1;
    this.usersDoc = this.firestore.doc(`users/${user.id}`);
    this.usersDoc.update(user);
  }

  deCreamentUserQueue(user: User) {
    user.queueSize += 1;
    this.usersDoc = this.firestore.doc(`users/${user.id}`);
    this.usersDoc.update(user);
  }

}
