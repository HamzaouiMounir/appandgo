import {  Storage } from '@ionic/storage';
import { AuthentificationService } from './../providers/authentification-service';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {SignInPage} from '../pages/sign-in/sign-in';
import {SignUpPage} from '../pages/sign-up/sign-up';
import {HomePage} from '../pages/home/home';
import {ResetPasswordPage} from '../pages/reset-password/reset-password';
import {PasswordConfigurationPage} from '../pages/password-configuration/password-configuration';
import { AclService } from 'angular2-acl';
import { ApiService } from './../providers/api-service';
import { RestangularModule } from 'ng2-restangular';
import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {SatellizerService} from '../providers/satellizer-service';
import { AngularFireModule } from 'angularfire2';

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
    HomePage,
    ResetPasswordPage,
    PasswordConfigurationPage
  ],
  imports: [
    IonicModule.forRoot(MyApp
    , {
        platforms : {
          android : {
            // These options are available in ionic-angular@2.0.0-beta.2 and up.
            scrollAssist: false,    // Valid options appear to be [true, false]
            autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
          }
          // http://ionicframework.com/docs/v2/api/config/Config/)
        }
      }),
     RestangularModule.forRoot(ApiService.RestangularConfigFactory),
     Ng2UiAuthModule.forRoot(SatellizerService),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    SignUpPage,
    HomePage,
    ResetPasswordPage,
    PasswordConfigurationPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},AclService,Storage,ApiService,AuthentificationService]
})
export class AppModule {}
