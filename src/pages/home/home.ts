import { Component } from '@angular/core';
import { NavController,ToastController, NavParams,LoadingController } from 'ionic-angular';
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
  userInformation:any={}
  editAttempt=false;
  me:any;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private API:ApiService,
  private aclService:AclService,
  public loader:LoadingController,
  public toastCtrl: ToastController) {
     
      
  }
  ngOnInit(){
    //initialisation du chargeur des données
    let loading=this.loader.create({
       content:'Chargement des données...'
     });
     loading.present().then(()=>{
        //on view loading we will call the api route users/me =>getMe
        this.API.all('users').one('me').get().subscribe(
              (response)=>{
                //affecting the response from the laravel api to userInformation using Restangular
                this.userInformation=this.API.copy(response);
                this.userInformation.data.current_password = '';
                this.userInformation.data.new_password = '';
                this.userInformation.data.new_password_confirmation = '';
                loading.dismiss();
              })
              
        // we have to use observable subscribe lifecycle Here
        //** to remember  */
     });
  }
  ionViewDidLoad() {
  }
  edit(){
    this.editAttempt=!this.editAttempt;
  }
  putMe(){
    //Here we use directly the userInformation copied response to implement the modification and send a put request 
    this.userInformation.put().subscribe(
    (response)=>{
      if(response.data=="success"){
          //alert(JSON.stringify(response));
          this.edit();
          this.presentToast('Informations enregistrées');
          
      }
     
    });
  }
   presentToast(message) {
   let toast = this.toastCtrl.create({
     message: message,
     duration: 3000
   });
   toast.present();
 }
  
}
