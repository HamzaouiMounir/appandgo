import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import {SignInPage} from '../pages/sign-in/sign-in';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = null;

  constructor(platform: Platform,private storage:Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.storage.get('satellizer_token').then((token)=>{
        console.log("From rooting : "+token)
        if(token!=null){
          this.rootPage=HomePage;
        }else{
          this.rootPage=SignInPage;
        }
      })
      StatusBar.styleDefault();
      Splashscreen.hide();

    });
  }
}
