import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Post } from '../classes/post';
import { User } from '../classes/user';
import { PostsService } from '../services/posts.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formPost: FormGroup;
  posts: Post[];
  usersSuggestions: User[];
  userSelector = '@';
  isSearching = false;
  pageTitle = 'Hoempage';
  backofficeLinkLabel = 'Backoffice';
  statusMessage: string;
  errorMessage = 'An error occured, please try again';
  removeConfirmation = 'Please confirm if you would like to delete this post';
  formLabels = {
    postBody: 'New Post: ',
    submit: 'Submit',
  }
  postLabels = {
    edit: 'Edit',
    remove: 'Remove',
    loading: 'Loading Posts...',
    noPosts: 'No Posts yet'
  }

  constructor(
    private postsService: PostsService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.formPost = new FormGroup({
      postID: new FormControl(''),
      postBody: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    this.getPosts();
  }

  getPosts() {
    this.postsService.getPosts().subscribe(posts => {
      this.posts = posts;
    }, () => {
      this.statusMessage = this.postsService.messages.errorPosts;
    });
  }

  addPost() {
    this.postsService.addPost(this.formPost.value).subscribe(() => {
      this.statusMessage = this.postsService.currentStatus;
      this.formPost.reset();
      this.getPosts();
    }, () => {
      this.statusMessage = this.errorMessage;
    });
  }

  editPost(post: Post) {
    this.formPost.setValue({
      postID: post.postID,
      postBody: post.postBody
    });
  }

  removePost(postID: number) {
    if (confirm(this.removeConfirmation)) {
      this.postsService.removePost(postID).subscribe(() => {
        this.statusMessage = this.postsService.currentStatus;
        this.getPosts();
      })
    }
  }

  validadeAutocomplete(inputValue: string) {
    const inputValueSplit = inputValue.split('@');
    const nameToSearch = inputValueSplit[inputValueSplit.length-1];
  
    if (inputValue.slice(-1) === this.userSelector || this.isSearching) {
      this.isSearching = true;
      this.getSuggestions(nameToSearch);
    }
  }

  getSuggestions(nameToSearch: string) {
    this.usersService.getSuggestions(nameToSearch).subscribe(users => {
      this.usersSuggestions = users;
    });
  }
}
