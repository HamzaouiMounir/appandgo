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

  constructor(public navCtrl: NavController, public navParams: NavParams,private API:ApiService,private aclService:AclService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.getMe();
  }
  private getMe(){
    let userData=this.API.service('me',this.API.all('users'));
    userData.one().get().then(
      (response)=>{
        alert(JSON.stringify(response));
      }
    )
  }

}
