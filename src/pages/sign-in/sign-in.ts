import { Storage } from '@ionic/storage';
import { HomePage } from './../home/home';
import { AuthentificationService } from './../../providers/authentification-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController,ViewController} from 'ionic-angular';
import { AclService } from 'angular2-acl';
import { ApiService } from './../../providers/api-service';
import {Facebook} from 'ionic-native';
import {SignUpPage} from '../sign-up/sign-up';
import {ResetPasswordPage} from '../reset-password/reset-password';
import {GlobalConfig} from './../../providers/global-config';
import {PasswordConfigurationPage} from '../password-configuration/password-configuration';

 declare var FirebasePlugin;
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignInPage {
 user ={
   email:'',
   password:''
 };
 userinfo={};
 error='';
 connected=false;
 idToken='';
 FB_APP_ID: number = GlobalConfig.FB_APP_ID;
  constructor(
    public viewCtrl:ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private API:ApiService,
    public aclService:AclService,
    public loader:LoadingController,
    private Auth:AuthentificationService,
    private storage:Storage) {
    Facebook.browserInit(this.FB_APP_ID);
    //Here we have to trySilentLogin for Google and/or Facebook Oauth to see if the user has been logged in or no
    this.storage.remove('satellizer_token');
    
}

  ionViewDidLoad() {
    //alert('ionViewDidLoad SignInPage');
    
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
             loading.dismiss();
             if(!resp.errors){
               this.userinfo=resp.data.user;
               this.Auth.setAbilitiesAndRolesToAcl(resp.data.abilities,resp.data.userRole);
               //alert('data: '+JSON.stringify(JSON.stringify(resp.data)));
               this.Auth.registerDeviceNotificationToken(resp.data.user.id);
                let credentials={
                id:resp.data.user.id,
                authType:'auth',
                requestToken:resp.data.token
            }
            this.Auth.storeUserCredentials(credentials)
               this.goToHomePage();
             }else{
               this.error='Vérifiez votre connectivité et réessayez!'
             }
           },
           (error)=>{
              loading.dismiss();
              this.error='Email ou mot de passe sont incorrectes';
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
           permissions = GlobalConfig.FACEBOOK_PERMISSIONS;
           Facebook.login(permissions)
           .then((response)=>{
             //alert("**ACCESS TOKEN =**"+JSON.stringify(response.authResponse.accessToken));
             let userId = response.authResponse.userID;
             let accessToken=response.authResponse.accessToken;
             let params = new Array();
             //Getting user information
            
             Facebook.api(GlobalConfig.FACEBOOK_API_REQUEST_PATH, params)
             .then((user) =>{
               user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
               //console.log(JSON.stringify(user))
                 this.oauthLoginApiRequest('facebook',accessToken);
             })
           }, (error)=>{
             alert(error);
           });
       }
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
   this.navCtrl.push(ResetPasswordPage);
 }

 checkStatusChangeCallback(){
      //alert('Checking the Status Changes');
  }
  disconnectFromFacebook(){
    Facebook.logout().then((facebookDisconnectionResponse)=>{
        alert('Disconnected User');
        alert(facebookDisconnectionResponse);
        //this.connected=false;
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
    //alert('statusChangeCallback');
    //alert(JSON.stringify(response));


    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for Facebook.getLoginStatus().
    if (response.status === 'connected') {
      this.connected=true;
      // Logged into your app and Facebook.
      //alert('Already connected')
    //alert('Fetching your information.... ');
    Facebook.api('/me',null).then((response)=> {
      //console.log('Successful login for: ' + response.name)
      //alert('Thanks for logging in, ' + response.name + '!')
    })
    //alert('end of fetching ')

     // this.testAPI(this.Facebook);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      // alert('not_authorized');
          

    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      //alert('not_authorized');
          

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
     this.Auth.loginWithGoogle().then((data) => {
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
        this.Auth.getAccessTokenFromServerAuthCode(data.serverAuthCode).subscribe(
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
    this.Auth.logoutFromGoogle().then(()=>{
      alert('disconnected');
       this.connected=false;
    });

  }
  //this private function will be called after Oauth Facebook or Google connexion to send the accessToken to the Laravel API
  private oauthLoginApiRequest(providerName,accessToken){
     let loading=this.loader.create({
       content:'Connexion avec votre compte '+providerName+' en cours...'
     });
     loading.present()
     .then(()=>{
        let callback=this.API.all('auth').all(providerName).one(accessToken);
        callback.get().subscribe(
          (callbackResponse)=>{
            alert("Connected on "+providerName+" provider");
            alert(JSON.stringify(callbackResponse));
            //check if the user is verified
            let verified = callbackResponse.data.user.email_verified;
            let credentials={
                  id:callbackResponse.data.user.id,
                  authType:providerName,
                  requestToken:callbackResponse.data.token
              }
            if(verified==0){
              //we have to push the user's mail to password-verification page in order to configure it's own password
              this.navCtrl.push(PasswordConfigurationPage,{
                                                            email:callbackResponse.data.user.email,
                                                            name:callbackResponse.data.user.name,
                                                            token:callbackResponse.data.token,
                                                            abilities:callbackResponse.data.abilities,
                                                            userRole:callbackResponse.data.userRole,
                                                            credentials:credentials
                                                          });
           }else{
              this.Auth.registerDeviceNotificationToken(callbackResponse.data.user.id);
              
            
              this.Auth.storeUserCredentials(credentials)
              this.Auth.setAbilitiesAndRolesToAcl(callbackResponse.data.abilities,callbackResponse.data.userRole);
              this.goToHomePage();
            }
            
            loading.dismiss();
          },
          (error)=>alert('error')
        );
     })
     .catch((err=>{
        alert('Connexion échouée, veuillez réessayer');
        loading.dismiss();
     }))
    
  }

  private goToHomePage(){
    
    this.navCtrl.setRoot(HomePage);
  }
  



}
