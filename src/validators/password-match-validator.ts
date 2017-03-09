import {FormControl} from '@angular/forms';
export class PasswordMatchValidator {
  static isPasswordMatch(password:FormControl,passwordConfirmation:FormControl){
    if(password.value==passwordConfirmation.value){
      return true;
    }
    return false;
  }
}
