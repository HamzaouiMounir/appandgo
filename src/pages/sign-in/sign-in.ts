import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { AclService } from 'angular2-acl';
import { ApiService } from './../../providers/api-service';
import {Facebook} from 'ionic-native';

import {SignUpPage} from '../sign-up/sign-up';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController,private API:ApiService,public aclService:AclService, public loader:LoadingController) {}

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

}
