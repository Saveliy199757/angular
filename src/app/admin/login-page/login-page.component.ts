import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as M from "materialize-css/dist/js/materialize";




@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup
  submitted = false
  message: string
  lang : string
  rusLower: string
  rusUpper: string
  enLower : string
  enUpper: string
  rus: string
  en: string
  langifen: boolean
  langifrus: boolean

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.message = 'Пожалуйста, введите данные'
        M.toast({html: `${this.message} <span>+</span>`})
      } else if (params['authFailed']) {
        this.message = 'Сессия истекла. Введите данные заново'
        M.toast({html: `${this.message} <span>+</span>`})
      }
    })

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

  }



  change(any) {
    this.rusLower = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
    this.enLower = 'abcdefghijklmnopqrstuvwxyz'
    this.rusUpper = this.rusLower.toUpperCase()
    this.enUpper = this.enLower.toUpperCase()
    this.rus = this.rusLower + this.rusUpper
      this.en = this.enLower + this.enUpper

    if (this.rus.includes(this.lang.slice(-1))) {
      this.langifrus = true
      this.langifen = false
    } else {
      this.langifrus = false
     this.langifen = true
    }
  }


  submit() {
    console.log(this.form)


    if (this.form.invalid) {
      return
    }





    this.submitted = true

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }


    this.auth.login(user).subscribe(() => {
       this.form.reset()
       this.router.navigate(['/admin', 'create'])
       this.submitted = false
    }, () => {
      this.submitted = false
    })



  }



}
