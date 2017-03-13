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

  
  constructor(public http: Http) {
    console.log('Hello GooglePlusService Provider');
  }
  getAccessTokenFromServerAuthCode(serverAuthCode):Observable<any>{
    let headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded')
      let data ='client_id=6996723272-kiv5cpplhama4ie93ubi0vdfmpmr43lo.apps.googleusercontent.com&client_secret=H9rDyxNEJzZaT8o6J-dNbFXd&grant_type=authorization_code&access_type=offline&code='+serverAuthCode
    
     return this.http.post('https://www.googleapis.com/oauth2/v4/token',data,{
            headers: headers
          }).map((res:Response) => res.json());
  }

}
