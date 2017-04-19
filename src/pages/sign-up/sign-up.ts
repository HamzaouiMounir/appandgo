import { Component } from '@angular/core';
import {FormBuilder,FormGroup,Validators,FormControl} from '@angular/forms';
import { NavController, NavParams , ToastController, LoadingController} from 'ionic-angular';
import { ApiService } from './../../providers/api-service';
import {EmailValidator} from '../../validators/email-validator';
import {SignInPage} from '../sign-in/sign-in';
/*
  Generated class for the SignUp page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
  user={};
  registrationForm:FormGroup;
  formSubmited=false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private API:ApiService,
    public loader:LoadingController,
    public formBuilder:FormBuilder) {
      //form validation with formBuilder
      this.registrationForm=this.formBuilder.group({
        name:['',Validators.compose([Validators.required,Validators.minLength(3)])],
        email:['',Validators.compose([Validators.required,EmailValidator.isValidMailFormat])],
        password:['',Validators.compose([Validators.required,Validators.minLength(8)])],
        password_confirmation:['',Validators.compose([Validators.required,Validators.minLength(8)])]
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }
  register(){

    this.formSubmited=true;
    if(this.registrationForm.valid){
      this.user={
        name:this.registrationForm.controls['name'].value,
        email:this.registrationForm.controls['email'].value,
        password:this.registrationForm.controls['password'].value,
        password_confirmation:this.registrationForm.controls['password_confirmation'].value,
      }
      console.log("We will send the user data to the database "+this.user);
      let reg= this.API.all('auth').all('register');
      reg.post(this.user).subscribe((registrationResponse)=>{
        alert(JSON.stringify(registrationResponse));
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

  returnToLoginPage(){
    this.navCtrl.setRoot(SignInPage);
  }
}
