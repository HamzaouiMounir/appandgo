import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Restangular } from 'ng2-restangular';

//This provider will handle the restangular configuration
@Injectable()
export class ApiService extends Restangular{
  //Restangular Configuration
  public static token='';
 static RestangularConfigFactory (RestangularProvider) {

 RestangularProvider.setBaseUrl('http://appandgo-mounir-customadmin.herokuapp.com/api/');
 RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
 // This function must return observable
 var refreshAccesstoken = function () {
   // Here you can make action before repeated request
   return Observable.of(true)
 };
 /**
  * The errorInterceptor is called whenever there's an error.
  * It's a function that receives the response, subject and the Restangular-response handler as parameters.
  */
 RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
   if (response.status === 403) {

     refreshAccesstoken()
     .switchMap(refreshAccesstokenResponse => {
       //If you want to change request or make with it some actions and give the request to the repeatRequest func.
       //Or you can live it empty and request will be the same.
       return response.repeatRequest(response.request);
     })
     .subscribe(
       res => responseHandler(res),
       err => subject.error(err)
     );

     return false; // error handled
   }
   return true; // error not handled
 });
 RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params)=> {
  let localStorage = new Storage();
  headers={
    'Content-Type':'application/json',
    'Accept':'application/x.laravel.v1+json'
  }
  //linking Restangular to Satelllizer token based Oauth
  localStorage.get('satellizer_token').then(
                  (val)=>{
                    this.token=val;
                  }
                )
    headers.Authorization='Bearer '+this.token;
  return {
    params: Object.assign({}, params, {}),
    headers: headers,
    element: element
  }
 });
 RestangularProvider.addResponseInterceptor((data, operation, what, url, response)=> {
      return data;
    });




}
}
