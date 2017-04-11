import {  Storage } from '@ionic/storage';
import { GooglePlusService } from './../providers/google-plus-service';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {SignInPage} from '../pages/sign-in/sign-in';
import {SignUpPage} from '../pages/sign-up/sign-up';
import {HomePage} from '../pages/home/home';
import { AclService } from 'angular2-acl';
import { ApiService } from './../providers/api-service';
import { RestangularModule } from 'ng2-restangular';
import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {SatellizerService} from '../providers/satellizer-service';
import { AngularFireModule } from 'angularfire2';
import { FirebaseAuthService } from '../providers/firebase-auth-service';
export const firebaseConfig = {
   apiKey: "AIzaSyBS_0QLme2x3h1tdTRrDitVqVfSTNNmNx4",
    authDomain: "appandgo-163110.firebaseapp.com",
    databaseURL: "https://appandgo-163110.firebaseio.com",
    projectId: "appandgo-163110",
    storageBucket: "appandgo-163110.appspot.com",
    messagingSenderId: "436973074865"
};
@NgModule({
  declarations: [
    MyApp,
    SignInPage,
    SignUpPage,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
     RestangularModule.forRoot(ApiService.RestangularConfigFactory),
     Ng2UiAuthModule.forRoot(SatellizerService),
     AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    SignUpPage,
    HomePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},AclService,Storage,ApiService,GooglePlusService,FirebaseAuthService]
})
export class AppModule {}
