import { Injectable } from '@angular/core';
import { Http,Headers,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
/*
  Generated class for the GooglePlusService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GooglePlusService {

  
  constructor(public http: Http) {  }
  //GooglePlusService is a local provider that emits a HTTP/POST request via getAccessTokenFromServerAuthCode method to this endpoint https://www.googleapis.com/oauth2/v4/token in order to get the accessToken using serverAuthCode
  getAccessTokenFromServerAuthCode(serverAuthCode):Observable<any>{
    let headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded')
      let data ='client_id=436973074865-3m1eif3ip5629oafl0fsldsptfp0pkrk.apps.googleusercontent.com&client_secret=AyQvrWfsV7COZ6rT_pi_r2nE&grant_type=authorization_code&access_type=offline&code='+serverAuthCode
    
     return this.http.post('https://www.googleapis.com/oauth2/v4/token',data,{
            headers: headers
          }).map((res:Response) => res.json());
  }

}
