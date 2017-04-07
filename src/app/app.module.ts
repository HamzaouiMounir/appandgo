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
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '20a50492'
  },
  'push': {
    'sender_id': '436973074865',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
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
     CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    SignUpPage,
    HomePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},AclService,Storage,ApiService,GooglePlusService]
})
export class AppModule {}
