import {  Storage } from '@ionic/storage';
import { AuthentificationService } from './../providers/authentification-service';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {SignInPage} from '../pages/sign-in/sign-in';
import {SignUpPage} from '../pages/sign-up/sign-up';
import {HomePage} from '../pages/home/home';
import {ResetPasswordPage} from '../pages/reset-password/reset-password';
import { AclService } from 'angular2-acl';
import { ApiService } from './../providers/api-service';
import { RestangularModule } from 'ng2-restangular';
import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {SatellizerService} from '../providers/satellizer-service';

@NgModule({
  declarations: [
    MyApp,
    SignInPage,
    SignUpPage,
    HomePage,
    ResetPasswordPage
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
     Ng2UiAuthModule.forRoot(SatellizerService)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    SignUpPage,
    HomePage,
    ResetPasswordPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},AclService,Storage,ApiService,AuthentificationService]
})
export class AppModule {}
