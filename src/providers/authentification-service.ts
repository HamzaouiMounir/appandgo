import { Injectable } from '@angular/core';
import { Http ,Headers,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import {GooglePlus} from 'ionic-native';
import {Facebook} from 'ionic-native';
import {GlobalConfig} from './global-config';
import { AclService } from 'angular2-acl';
import { ApiService } from './api-service';
import { Storage } from '@ionic/storage';
declare var FirebasePlugin;
//This service handles all the Authentification process types( Simple Authentification, Google & Facebook providers)
@Injectable()
export class AuthentificationService {
  public authResponse:any;
  constructor(public http: Http,
              public aclService:AclService,
              private API:ApiService,
              public localStorage:Storage) {
    console.log('Hello AuthentificationService Provider');
  }

  //GooglePlusService is a local provider that emits a HTTP/POST request via getAccessTokenFromServerAuthCode method to this endpoint https://www.googleapis.com/oauth2/v4/token in order to get the accessToken using serverAuthCode
  getAccessTokenFromServerAuthCode(serverAuthCode):Observable<any>{
    let headers = new Headers();
    headers.append('Content-Type',GlobalConfig.HEADER_CONTENT_TYPE)
     return this.http.post(GlobalConfig.URL_FOR_ACCESS_TOKEN,GlobalConfig.URL_FOR_ACCESS_TOKEN_DATA+serverAuthCode,{
            headers: headers
          }).map((res:Response) => res.json());
  }
    //Google+ login native Oauth
  loginWithGoogle(){
    
    //We use the login static function of GooglePlus
    /**
     * options in this function are:
     * scopes
     * webClientId: which is the client id attached to a web application in your Google console's project
     * offline mode is a configuration used with the webClientId to get the serverAuthCode and the tokenId from the serverAuthCode
     */
     return GooglePlus.login({
      "scopes":"",
      "webClientId": "436973074865-3m1eif3ip5629oafl0fsldsptfp0pkrk.apps.googleusercontent.com",
      "offline": true
    });
  }
  //Logout from Google
  logoutFromGoogle(){
    return GooglePlus.logout();
  }
  

 
  //This function will store Abilities and Roles to AclService
 setAbilitiesAndRolesToAcl(abilities,roles){
   //setting abilities to AclService
   this.aclService.setAbilities(abilities);
   //fetching and attaching all user roles to AclService
   roles.forEach(role => {
               this.aclService.attachRole(role);        
   });
 } 

 //This function get firebase fcm token and register it as a device notification token to the database
  registerDeviceNotificationToken(userID){
     //alert('this is users id='+userID );
     FirebasePlugin.getToken((token) =>{
                    // save this server-side and use it to push notifications to this device
                    //alert("Firebase Token: "+token);
                    let refreshCallback=this.API.all('notifications').all('refresh_token').all(userID).one(token);
                    refreshCallback.get().subscribe(
                      (response)=>{
                        //alert(JSON.stringify(response)); 
                      }
                    );
                }, (error) =>{
                    alert("Error: "+error);
                });
    }
  //Saving connected user's credentials for further checking process 
  //if these params are set in the localStorage, the user will be redirected to the home page
  //@params(id): represent the user id
  //@params(authType): the Authentification type ('google','facebook','simple auth','other')
  //@params(requestToken): 'Authorization':'Bearer Token'
    storeUserCredentials(user){
      this.localStorage.set('id',user.id);
      this.localStorage.set('authType',user.authType);
      this.localStorage.set('satellizer_token',user.requestToken);
    }
  //Removing user credentials from localStorage
  //This operation is generally used while user disconnect from the app
    resetUserCredentials(){
      //removing the credentials
      this.localStorage.remove('id');
      this.localStorage.remove('authType');
      this.localStorage.remove('satellizer_token');
      //then we can remove the access control database
      this.aclService.data.roles=[];
      this.aclService.data.abilities=[];
    }

}
