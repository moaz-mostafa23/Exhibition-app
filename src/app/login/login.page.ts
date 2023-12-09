import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../auth.service';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email:string = "";
  password:string = "";
  emailErrorText:string = "";
  passwordErrorText:string = "";
  constructor(private auth:AuthService, private load:LoadingController, private navCtrl: NavController) { }

  emailWrong(){
    if(this.email === ""){
      this.emailErrorText = "Email is blank";
      return true;
    }else{
      return false;
    }
  }

  passWrong(){
    if(this.password === ""){
      this.passwordErrorText = "Password is blank";
      return true;
    }
      return false;
  }

  async Login(){
    if(!this.passWrong() && !this.emailWrong()){
      const loader = await this.load.create({message: "Logging in..."});
      try{
        loader.present();
      const currentUser = await this.auth.login(this.email, this.password);
      await loader.dismiss();
      console.log(currentUser);
      this.auth.userLoggedIn.next(true);
      this.navCtrl.navigateForward('/tabs');
      }catch(err){
        await loader.dismiss();
        console.log(err);
      }
    }
  }



  ngOnInit() {
  }

}
