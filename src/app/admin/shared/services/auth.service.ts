import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {Observable, Subject, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import * as M from "materialize-css/dist/js/materialize";


@Injectable({providedIn: 'root'})

export class AuthService {

  public error$: Subject<string> = new Subject<string>()

  constructor(private http: HttpClient) {
  }

  get token():string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
   if (new Date() > expDate) {
     this.logout()
     return null
   }

    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
   return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
     .pipe(
       tap(this.setToken),
       catchError(this.handleError.bind(this))
     )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }


  public handleError(error: HttpErrorResponse) {
     const {message} = error.error.error

    console.log(message)

  switch (message) {
    case 'INVALID_PASSWORD':
      M.toast({html: 'Неверный пароль <span>+</span>'})
      break
    case 'INVALID_EMAIL':
      M.toast({html: 'Неверный email <span>+</span>'})
      break
    case 'EMAIL_NOT_FOUND':
      /*this.error$.next('Email не найден')*/
      M.toast({html: 'Email не найден <span>+</span>'})
      break



}


    return throwError(error)

  }


  private setToken(response: FbAuthResponse | null) {
   if (response) {
     const exDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
     localStorage.setItem('fb-token', response.idToken)
     localStorage.setItem('fb-token-exp', exDate.toString())
   } else {
     localStorage.clear()
   }


  }

}
