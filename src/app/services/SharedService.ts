import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

    public user: any;

    setUser(user: any) {
        localStorage.setItem("USER", user)
    }

    getUser() {
        return localStorage.getItem("USER")
    }

}