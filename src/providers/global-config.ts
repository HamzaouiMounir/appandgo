import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class GlobalConfig {
  /* Begin Google Config Vars */
  public static CLIENT_ID='436973074865-3m1eif3ip5629oafl0fsldsptfp0pkrk.apps.googleusercontent.com&client_secret=AyQvrWfsV7COZ6rT_pi_r2nE';
  public static CLIENT_SECRET='AyQvrWfsV7COZ6rT_pi_r2nE';
  public static WEB_CLIENT_ID='436973074865-3m1eif3ip5629oafl0fsldsptfp0pkrk.apps.googleusercontent.com';
  public static GRANT_TYPE='authorization_code';
  public static ACCESS_TYPE='offline';
  public static HEADER_CONTENT_TYPE='application/x-www-form-urlencoded';
  public static URL_FOR_ACCESS_TOKEN='https://www.googleapis.com/oauth2/v4/token';
  public static URL_FOR_ACCESS_TOKEN_DATA='client_id='+GlobalConfig.CLIENT_ID+'&client_secret='+GlobalConfig.CLIENT_SECRET+'&grant_type='+GlobalConfig.GRANT_TYPE+'&access_type='+GlobalConfig.ACCESS_TYPE+'&code=';
  /* End Google Config Vars */

  /* Begin Facebook Config Vars */
  public static FB_APP_ID: number = 1368002846591785;
  public static FACEBOOK_PERMISSIONS=["public_profile"];
  public static FACEBOOK_API_REQUEST_PATH='/me?fields=name,gender,age_range,first_name,last_name';
  /* Begin Restangular Config Vars */
  public static API_BASE_URL='http://192.168.1.6:3000/api/';
  public static RESTANGULAR_DEFAULT_HEADER={'Content-Type': 'application/json'};
  /* End Restangular Config Vars */
}
