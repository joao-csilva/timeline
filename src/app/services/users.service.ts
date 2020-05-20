import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usernameFormat = new RegExp('[\\w-_]+');
  messages = {
    invalidUsername: 'Invalid Username',
    phoneInUse: 'Phone number is already registered',
    errorUsers: 'Cannot retreive users',
    error: 'Error please try again',
    userAdded: 'Added user',
    userEdited: 'User edited',
    userDeleted: 'User deleted'
  }
  currentStatus: string;
  suggestionsToDisplay = 3;

  constructor() { }

  getUsers(): Observable<User[]> {
    const users = JSON.parse(window.localStorage.getItem("users"));
    return of(users);
  }

  addUser(user: User): Observable<any> {
    return of(this.getUsers().subscribe(users => {

      const userList = users || [];
      // This helps the flow of the code since we are using localStorage

      if (!this.usernameFormat.test(user.username)) {
        this.currentStatus = this.messages.invalidUsername;

      } else if (this.searchPhone(userList, user.phone)) {
        this.currentStatus = this.messages.phoneInUse;

      } else {
        if (user.userID) {
          this.editUser(userList, user);

        } else {
          user.userID = users ? userList[userList.length - 1].userID + 1 : 1;
          userList.push(user);
          this.currentStatus = this.messages.userAdded;

        }
        localStorage.setItem('users', JSON.stringify(userList));
      }
    }, () => {
      this.currentStatus = this.messages.errorUsers;
      return of(null);
    }));
  }

  editUser(users: User[], usertoEdit: User) {
    users.forEach(user => {
      if (user.userID === usertoEdit.userID) {
        user.name = usertoEdit.name;
        user.username = usertoEdit.username;
        user.phone = usertoEdit.phone;
        user.role = usertoEdit.role;
        this.currentStatus = this.messages.userEdited;
        return;
      }
    });
  }

  removeUser(userID: number): Observable<any> {
    return of(this.getUsers().subscribe(users => {

      for (let i = 0; i < users.length; i++) {
        if (users[i].userID === userID) {
          users.splice(i, 1);
          this.currentStatus = this.messages.userDeleted;
          break;
        }
      }
      // You can also use filter(), but I think this is more performance friendly

      localStorage.setItem('users', JSON.stringify(users));
    }, () => {
      this.currentStatus = this.messages.errorUsers;
      return of(null);
    }));
  }

  searchPhone(users: User[], phone: string): boolean {
    users.forEach(user => {
      if (user.phone === phone) {
        return true;
      }
    });
    return false;
  }

  getSuggestions(nameToSearch: string): Observable<User[]> {
    const users = JSON.parse(window.localStorage.getItem("users"));
    if (nameToSearch !== '') {
      let suggestions: User[] = [];

      for (let i = 0; i < users.length; i++) {
        let isMatch = true;
        suggestionSearch:

        for(let j = 0; j < nameToSearch.length; j++) {
          if (users[i].name.charAt(j) !== nameToSearch.charAt(j)) {
            isMatch = false;
            break suggestionSearch;
          }
        }

        if (isMatch) {
          suggestions.push(users[i]);
        }
      }
      return of(suggestions);

    } else {
      return of(users.slice(0, this.suggestionsToDisplay));
    }
  }
}
