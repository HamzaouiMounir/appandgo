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
 FB_APP_ID: number = 1368002846591785;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private API:ApiService,
    public aclService:AclService,
    public loader:LoadingController,
    public auth:AuthService) {
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

                // let authParams={provider:'facebook',oauthUser:user}
                 // alert("PROVIDER ID SENT TO API"+JSON.stringify(user));
                 this.oauthLoginApiRequest('facebook',accessToken);


                 /*
                 In case of need these code below will use a post method to send OauthProviderId and the provider to the api
                 this.service.facebookAuthPOSTHttp(user.id).subscribe(
                     (resp)=>{
                         alert(JSON.stringify(resp));
                     });
                 */
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
  //Google + login native
  googlePlusNativeConnect(){
    GooglePlus.login()
      .then(res => alert("GOOGLE RESPONSE"+JSON.stringify(res)))
      .catch(err => console.error(err));
  }
  //This function use the sattelizer Oauth operation using the provider's name as a param
  sattelizerOauth(provider){
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
