import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {postsService} from "../../shared/posts.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {alertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  pSub: Subscription
  dSub: Subscription
  searchStr = ''


  constructor(
    private postsService: postsService,
    private alert: alertService
  ) { }

  ngOnInit(): void {
    this.postsService.getAll().subscribe( posts => {
      this.posts = posts
    })
  }

  remove(id: string) {
     this.dSub = this.postsService.remove(id).subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== id)
       this.alert.warning('Пост был удалён')
      })
  }


  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }

    if (this.dSub) {
      this.dSub.unsubscribe()
    }
  }


}
