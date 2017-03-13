import { GooglePlusService } from './../../providers/google-plus-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { AclService } from 'angular2-acl';
import { ApiService } from './../../providers/api-service';
import {Facebook} from 'ionic-native';
import {SignUpPage} from '../sign-up/sign-up';
import {AuthService} from 'ng2-ui-auth';
import { GooglePlus } from 'ionic-native';

/*
  Generated class for the SignIn page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignInPage {
 user ={};
 userinfo={};
 error='';
 connected=false;
 idToken='';
 FB_APP_ID: number = 1368002846591785;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private API:ApiService,
    public aclService:AclService,
    public loader:LoadingController,
    public auth:AuthService,
    private gplusService:GooglePlusService) {
    Facebook.browserInit(this.FB_APP_ID);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }


  connect(){
    //showing Loader
     let loading=this.loader.create({
       content:'Connexion en cours ...'
     });
     loading.present().then(()=>{
        let auth= this.API.all('auth').all('login');
         auth.post(this.user).subscribe(
           (resp)=>{
             if(!resp.errors){
               this.connected=true;
               this.userinfo=resp.data.user;
               this.setAbilitiesAndRolesToAcl(resp.data.abilities,resp.data.userRole);
                loading.dismiss();
             }else{
               this.error='Email ou mot de passe sont incorrectes';
             }
           }
         );

     });
  }
  facebookOath(){
    //check if the user has already logged in
       this.checkConnectivityState();
       if(!this.connected){
           //Connexion à Facebook
           let permissions = new Array();
           //the permissions your facebook app needs from the user
           permissions = ["public_profile"];
           Facebook.login(permissions)
           .then((response)=>{
             alert("**ACCESS TOKEN =**"+JSON.stringify(response.authResponse.accessToken));
             let userId = response.authResponse.userID;
             let accessToken=response.authResponse.accessToken;
             let params = new Array();
             //Getting user information
             Facebook.api("/me?fields=name,gender,age_range,first_name,last_name", params)
             .then((user) =>{
               user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
               console.log(JSON.stringify(user));
               
                 this.oauthLoginApiRequest('facebook',accessToken);
             })
           }, (error)=>{
             alert(error);
           });
       }
  }
  /*logout(){
   this.connected=false;
   this.aclService.data.roles=[];
   this.aclService.data.abilities=[];

 }*/
 //This function will store Abilities and Roles to AclService
 setAbilitiesAndRolesToAcl(abilities,roles){
   //setting abilities to AclService
   this.aclService.setAbilities(abilities);
   //fetching and attaching all user roles to AclService
   roles.forEach(role => {
               console.log(role);
               this.aclService.attachRole(role);
               console.log(this.aclService.getRoleAbilities(role));
   });
 }

 presentToast() {
   let toast = this.toastCtrl.create({
     message: 'Connexion établie avec succée',
     duration: 3000
   });
   toast.present();
 }
 goToRegistration(){
   this.navCtrl.push(SignUpPage);
 }
 goToTermsAndConditions(){
   alert('Termes & Conditions page');
 }

  checkStatusChangeCallback(){
      alert('Checking the Status Changes');
  }
  disconnectFromFacebook(){
    Facebook.logout().then((facebookDisconnectionResponse)=>{
        alert('Disconnected User');
        alert(facebookDisconnectionResponse);
        this.connected=false;
    },(error)=>{
        alert(error);
    })
  }
  checkConnectivityState(){
    Facebook.getLoginStatus().then((response)=> {
    this.statusChangeCallback(response);
  });
  }
  // This is called with the results from from Facebook.getLoginStatus().
   statusChangeCallback(response) {
    alert('statusChangeCallback');
    alert(JSON.stringify(response));


    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for Facebook.getLoginStatus().
    if (response.status === 'connected') {
      this.connected=true;
      // Logged into your app and Facebook.
      alert('Already connected')
    alert('Fetching your information.... ');
    Facebook.api('/me',null).then((response)=> {
      console.log('Successful login for: ' + response.name)
      alert('Thanks for logging in, ' + response.name + '!')
    })
    alert('end of fetching ')

     // this.testAPI(this.Facebook);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
          alert('not_authorized');
          this.connected=false;

    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
          alert('not_authorized');
          this.connected=false;

    }
  }
   checkLoginState(Facebook) {
      Facebook.getLoginStatus(
        (response)=> {
        this.statusChangeCallback(response)
      }
      );
  }
  //Google+ login native Oauth
  googlePlusNativeConnect(){
    this.connected=true;
    //We use the login static function of GooglePlus 
    /**
     * options in this function are:
     * scopes
     * webClientId: which is the client id attached to a web application in your Google console's project
     * offline mode is a configuration used with the webClientId to get the serverAuthCode and the tokenId from the serverAuthCode
     */
     GooglePlus.login({
      "scopes":"",
      "webClientId": "6996723272-kiv5cpplhama4ie93ubi0vdfmpmr43lo.apps.googleusercontent.com",
      "offline": true
    }).then((data) => {
        /*alert(JSON.stringify(data));
        alert("ServerAuthCode to send to the api= "+data.serverAuthCode);*/
        /**
         * Data response contains multiple field 
         * data.email          // 'hamzaouimounir@example.com'
         * data.userId         // user id
         * data.displayName    // 'Mounir Hamzaoui'
         * data.familyName     // 'Hamzaoui'
         * data.givenName      // 'Mounir'
         * data.imageUrl       // 'http://link-to-my-profilepic.google.com'
         * data.idToken        // idToken that can be exchanged to verify user identity.
         * data.serverAuthCode // Auth code that can be exchanged for an access token and refresh token for offline access
         */
        //GooglePlusService is a local provider that emit a HTTP/POST request to this endpoint https://www.googleapis.com/oauth2/v4/token in order to get the accessToken using serverAuthCode
        this.gplusService.getAccessTokenFromServerAuthCode(data.serverAuthCode).subscribe(
         data => {
        //retreiving the accessToken in this response and send it to the oauthLoginApiRequest which is a function that call the Laravel API endpoint using the provider name ='google' and the accessToken param
                this.oauthLoginApiRequest('google',data.access_token);
        },
        err => alert("Err=> "+err),
        () => alert('Success Connexion')
      )
      }).catch((data) => {
        alert("ERROR"+JSON.stringify(data));
      });
  }
  //Logout from Google
  disconnectFromGoogle(){
    GooglePlus.logout().then(()=>{
      alert('disconnected');
       this.connected=false;
    });

  }
  //This function use the sattelizer Oauth operation using the provider's name as a param
  sattelizerOauth(provider){
    //you can use this method till 20th april then the integrated based Oauth for Google Plus will be blocked
      this.auth.authenticate(provider).subscribe({
                next: (user) => {
                  console.log(JSON.stringify(user))
                },
                error: (err: any) => alert("error"+err),
                complete: () => console.log('connected')
            });

  }
  //this private function will be called after Oauth Facebook or Google connexion to send the accessToken to the Laravel API
  private oauthLoginApiRequest(providerName,accessToken){
    let callback=this.API.all('auth').one(providerName,accessToken);
        callback.get().subscribe(
          (callbackResponse)=>{
            alert("Connected on "+providerName+" provider");
            alert(JSON.stringify(callbackResponse.data));
          }
        );
  }


}
