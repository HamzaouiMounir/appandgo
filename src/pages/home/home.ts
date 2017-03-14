import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AclService } from 'angular2-acl';
import { ApiService } from './../../providers/api-service';
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
  userInformation:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams,private API:ApiService,private aclService:AclService) {
      this.getMe();
      alert(JSON.stringify(this.userInformation.data));
      
  }

  ionViewDidLoad() {
    alert('ionViewDidLoad HomePage');
    this.getMe();

  }
  private getMe(){
    let userData=this.API.all('users');
    userData.get('me').subscribe(
      (response)=>{
        
        this.userInformation=this.API.copy(response);
        alert(JSON.stringify(this.userInformation.data));
        /*this.userInformation.data.current_password = ''
        this.userInformation.data.new_password = ''
        this.userInformation.data.new_password_confirmation = ''*/
        
      }
    )
   
  }
  putMe(){
    this.userInformation.put().then(()=>{
      alert('success');
    },
    (response)=>{
      alert(response);
    }).catch((err)=>{
      alert("error:"+err)
    })
  }

}
