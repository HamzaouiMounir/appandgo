import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {CustomConfig} from 'ng2-ui-auth';

//Sattelizer Configuration service
export const GOOGLE_CLIENT_ID = '320931197193-t4tdc2b6655e4cb8bh1mok8qqse2alic.apps.googleusercontent.com';
export class SatellizerService extends CustomConfig {
  defaultHeaders = {'Content-Type': 'application/json'};
  baseUrl:'http://localhost:8100/';
  providers = {google:{
                        clientId: GOOGLE_CLIENT_ID,
                        url:this.baseUrl,
                        redirectUri:'http://localhost:8100'
                      }
              };
  tokenName = 'token';
  tokenPrefix = 'satellizer';
  tokenHeader = 'Authorization';
  tokenType = 'Bearer';
  storageType = 'localStorage';


}
