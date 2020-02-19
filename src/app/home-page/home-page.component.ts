import { Component, OnInit, NgModule } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import {postsService} from "../shared/posts.service";
import {Observable} from "rxjs";
import {Post} from "../shared/interfaces";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  posts$: Observable<Post[]>

  constructor(
    private postsService: postsService
  ) { }

  ngOnInit(): void {
   this.posts$ = this.postsService.getAll()
  }


}
