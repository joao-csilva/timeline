import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '../classes/user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent implements OnInit {

  formUser: FormGroup;
  users: User[];
  pageTitle = 'User Management';
  homeLinkLabel = 'Home';
  statusMessage: string;
  errorMessage = 'An error occured, please try again';
  removeConfirmation = 'Please confirm if you would like to delete ';
  formLabels = {
    username: 'Username: ',
    name: 'Name: ',
    phone: 'Phone: ',
    role: 'Role: ',
    submit: 'Submit'
  }
  userCardLabels = {
    edit: 'Edit',
    remove: 'Remove',
    loading: 'Loading...',
    noUsers: 'No Users'
  }
  

  constructor(
    private usersService: UsersService
  ) {
  }

  ngOnInit() {
    this.formUser = new FormGroup({
      userID: new FormControl(''),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]),
      role: new FormControl('', [Validators.required])
    });

    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
    }, () => {
      this.statusMessage = this.usersService.messages.errorUsers;
    });
  }

  addUser() {
    this.usersService.addUser(this.formUser.value).subscribe(() => {
      this.statusMessage = this.usersService.currentStatus;
      if (
        this.usersService.currentStatus === this.usersService.messages.userAdded ||
        this.usersService.currentStatus === this.usersService.messages.userEdited
      ) {
        this.formUser.reset();
        this.getUsers();
      }
    }, () => {
      this.statusMessage = this.errorMessage;
    });
  }

  editUser(user: User) {
    this.formUser.setValue({
      userID: user.userID,
      username: user.username,
      name: user.name,
      phone: user.phone,
      role: user.role
    });
  }

  removeUser(user: User) {
    if (confirm(this.removeConfirmation + user.name)) {
      this.usersService.removeUser(user.userID).subscribe(() => {
        this.statusMessage = this.usersService.currentStatus;
        this.getUsers();
      })
    }
  }
}
