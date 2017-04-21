import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder,FormGroup,Validators,FormControl} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ApiService } from './../../providers/api-service';
import { AuthentificationService } from './../../providers/authentification-service';
import { HomePage } from './../home/home';
@Component({
  selector: 'page-password-configuration',
  templateUrl: 'password-configuration.html'
})
export class PasswordConfigurationPage {
passwordConfigForm:FormGroup;
username:string;
email:string;
requestToken:string;
abilities:any;
userRole:any;
credentials:any;
  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams,
  public formBuilder:FormBuilder,
  public localStorage:Storage,
  private API:ApiService,
  private Auth:AuthentificationService
  ) {

    this.passwordConfigForm=this.formBuilder.group({
        password:['',Validators.compose([Validators.required,Validators.minLength(8)])],
        password_confirmation:['',Validators.compose([Validators.required,Validators.minLength(8)])]
      });

      this.username=this.navParams.get('name');
      this.email=this.navParams.get('email');
      this.requestToken=this.navParams.get('token');
      this.abilities=this.navParams.get('abilities');
      this.userRole=this.navParams.get('userRole');
      this.credentials=this.navParams.get('credentials');
      this.localStorage.set('satellizer_token',this.requestToken);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordConfigurationPage');
    alert('this is the request token '+this.requestToken);
  }

  configure(){
    let user = {
      email:this.email,
      password:this.passwordConfigForm.controls['password'].value
    }
      this.API.all('password').all('configure').post(user).subscribe(
        (successResponse)=>{
            alert(JSON.stringify(successResponse))
            this.Auth.registerDeviceNotificationToken(successResponse.data.id)
            this.Auth.storeUserCredentials(this.credentials)
              this.Auth.setAbilitiesAndRolesToAcl(this.abilities,this.userRole);
              this.navCtrl.setRoot(HomePage);
        },
        (error)=>{
          alert(error)
        },
        ()=>alert('User Verification process complete')
      )
  }

}
