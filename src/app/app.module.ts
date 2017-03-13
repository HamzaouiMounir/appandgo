import { GooglePlusService } from './../providers/google-plus-service';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {SignInPage} from '../pages/sign-in/sign-in';
import {SignUpPage} from '../pages/sign-up/sign-up';
import { AclService } from 'angular2-acl';
import { ApiService } from './../providers/api-service';
import { RestangularModule } from 'ng2-restangular';
import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {SatellizerService} from '../providers/satellizer-service';
@NgModule({
  declarations: [
    MyApp,
    SignInPage,
    SignUpPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
     RestangularModule.forRoot(ApiService.RestangularConfigFactory),
     Ng2UiAuthModule.forRoot(SatellizerService)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    SignUpPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},AclService,Storage,ApiService,GooglePlusService]
})
export class AppModule {}
