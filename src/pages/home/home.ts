import { Component } from '@angular/core';
import { NavController,ToastController, NavParams,LoadingController,ViewController } from 'ionic-angular';
import { AclService } from 'angular2-acl';
import { ApiService } from './../../providers/api-service';
import { Storage } from '@ionic/storage';
import { AuthentificationService } from './../../providers/authentification-service';
import { GlobalConfig } from './../../providers/global-config';
import {Facebook} from 'ionic-native';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
import {SignInPage} from '../sign-in/sign-in';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userInformation:any={}
  editAttempt=false;
  loaded=false;
  me:any;
  satellizerToken;
  authType:any;
  userid:any;
  constructor(public navCtrl: NavController, 
  public viewCtrl:ViewController,
  public navParams: NavParams,
  private API:ApiService,
  private aclService:AclService,
  public loader:LoadingController,
  public toastCtrl: ToastController,
  public push: Push,
  private Auth:AuthentificationService,
  private storage:Storage) {
      this.storage.get('satellizer_token').then((value)=>{
       //alert('requestToken='+value);
       this.satellizerToken=value;
    })
       this.storage.get('authType').then((value)=>{
       //alert('authType='+value);
       this.authType=value;
    })
    this.storage.get('id').then((value)=>{
       //alert('userid='+value);
       this.userid=value;
    })
    if(this.authType=='facebook'){
        Facebook.browserInit(GlobalConfig.FB_APP_ID);
    }
    
  }
  ngOnInit(){
    //this.storage.set('satellizer_token',this.satellizerToken);
       //initialisation du chargeur des données
     
    
  }
  load(){
    //alert('this is the request token:'+this.satellizerToken);
    let loading=this.loader.create({
       content:'Chargement des données...'
     });
     loading.present().then(()=>{
        //on view loading we will call the api route users/me =>getMe
        this.API.all('users').one('me').get().subscribe(
              (response)=>{
                
                //affecting the response from the laravel api to userInformation using Restangular
                this.userInformation=this.API.copy(response);
                this.userInformation.data.current_password = '';
                this.userInformation.data.new_password = '';
                this.userInformation.data.new_password_confirmation = '';
                loading.dismiss();
                this.loaded=true;
              },
              (err)=>{
                loading.dismiss()
                //this is a retry to load method, which is not recommended but it's just for testing cases
                this.load();
                
            },
            ()=>{
              //alert('finish');
              loading.dismiss();
            });
              
        // we have to use observable subscribe lifecycle Here
        //** to remember  */
     }); 
  }
  ionViewDidLoad() {
  }
  edit(){
    this.editAttempt=!this.editAttempt;
  }
  putMe(){
    //Here we use directly the userInformation copied response to implement the modification and send a put request 
    this.userInformation.put().subscribe(
    (response)=>{
      if(response.data=="success"){
          //alert(JSON.stringify(response));
          this.edit();
          this.presentToast('Informations enregistrées');
          
      }
     
    });
  }
   presentToast(message) {
   let toast = this.toastCtrl.create({
     message: message,
     duration: 3000
   });
   toast.present();
 }

 logout(){
   alert(this.authType);
    switch(this.authType){
      case 'google': 
      //alert('You are disconnecting from your '+this.authType+' account linked to APP and GO starter app');
      this.Auth.logoutFromGoogle().then(()=>{
        alert('Bye Bye');
        this.Auth.resetUserCredentials();
      })
      break;
      case 'facebook':
      //alert('You are disconnecting from your '+this.authType+' account linked to APP and GO starter app');
      
      Facebook.logout().then((facebookDisconnectionResponse)=>{
            alert('Bye Bye');
            //this.connected=false;
        },(error)=>{
            alert("Ooops There is an error");
        })
      this.Auth.resetUserCredentials();
      break;
      default:
      //alert('You are disconnecting from your APP and GO account');
      alert('Bye Bye');
        this.Auth.resetUserCredentials();
      break;
    }
    this.authType=null;
    this.satellizerToken=null;
    this.userid=null;
    this.navCtrl.setRoot(SignInPage);
  
 }
  
}
