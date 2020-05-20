import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../classes/post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  currentStatus: string;
  messages = {
    postAdded: 'Added post',
    postEdited: 'Post edited',
    postDeleted: 'Post deleted',
    errorPosts: 'Cannot retreive posts',
    error: 'Error please try again',
  }

  constructor() { }

  getPosts(): Observable<Post[]> {
    const posts = JSON.parse(window.localStorage.getItem("posts"));
    return of(posts);
  }

  addPost(post: Post): Observable<any> {
    return of(this.getPosts().subscribe(posts => {

      const postsList = posts || [];
      // This helps the flow of the code since we are using localStorage

      if (post.postID) {
        this.editPost(postsList, post);

      } else {
        post.postID = posts ? postsList[postsList.length - 1].postID + 1 : 1;
        postsList.push(post);
        this.currentStatus = this.messages.postAdded;

      }
      localStorage.setItem('posts', JSON.stringify(postsList));
    }, () => {
      this.currentStatus = this.messages.error;
      return of(null);
    }));
  }

  editPost(posts: Post[], postToEdit: Post) {
    posts.forEach(post => {
      if (post.postID === postToEdit.postID) {
        post.postBody = postToEdit.postBody;
        this.currentStatus = this.messages.postEdited;
        return;
      }
    });
  }

  removePost(postID: number): Observable<any> {
    return of(this.getPosts().subscribe(posts => {

      for (let i = 0; i < posts.length; i++) {
        if (posts[i].postID === postID) {
          posts.splice(i, 1);
          this.currentStatus = this.messages.postDeleted;
          break;
        }
      }
      // You can also use filter(), but I think this is more performance friendly

      localStorage.setItem('posts', JSON.stringify(posts));
    }, () => {
      this.currentStatus = this.messages.error;
      return of(null);
    }));
  }
}
