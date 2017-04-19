import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SignInPage} from '../sign-in/sign-in';
import {SignUpPage} from '../sign-up/sign-up';
/*
  Generated class for the ResetPassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }
  goToHome(){
    this.navCtrl.setRoot(SignInPage);
  }
  goToSubscription(){
    this.navCtrl.setRoot(SignUpPage);
  }

}
