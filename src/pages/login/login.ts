import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import Swal from 'sweetalert2';

import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public apiLink: any;
  public loader: any;
  public localData: any;
  public regeneratePasswordData: any;

  @ViewChild('username') loginUsername;
  @ViewChild('password') loginPassword;  

  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, private alertCtrl: AlertController, public loadingControl: LoadingController) {

    this.apiLink = "https://focus-agency.herokuapp.com/";    

    this.menu = menu;
    this.menu.enable(false, 'sideMenuID');
    /*this.menu.swipeEnable(false);*/

  }

  showLoading(loadingMessage) {
    this.loader = this.loadingControl.create({
      content: ""+loadingMessage
    });

    this.loader.present();
  }

  showSuccessMessage(successMessage: String) {

    Swal.fire(
      'Success!',
      ''+successMessage+'',
      'success'
      )

  }

  showInformationMessage(information: String) {

    Swal.fire(
      'Info!',
      ''+information+'',
      'info'
      )

  }

  showErrorMessage(errorMessage: String) {

    Swal.fire(
      'Error!',
      ''+errorMessage+'',
      'error'
      )
    
  }

  login() {

    var receivedUsername = this.loginUsername.value;
    var receivedPassword = this.loginPassword.value;

    if((receivedUsername == '')||(receivedPassword == ''))
    {
      this.showErrorMessage("Please supply your username and password to proceed.");
    }
    else
    {
      this.showLoading("Authenticacting, please wait...");

      this.http.get(this.apiLink+'rest_login/?username='+receivedUsername+'&password='+receivedPassword+'&format=json').subscribe(

        authData => {

          this.loader.dismiss();

          if(authData != '') {

            if((authData[0].result == '0')||(authData[0].result == 0))
            {
              this.showErrorMessage(authData[0].error);
            }
            else
            {
              window.localStorage.setItem('focused_app4Tr12__user_is_logged', 'true');
              window.localStorage.setItem('focused_app4Tr12__tokenExpired', 'false');
              window.localStorage.setItem('focused_app4Tr12__loginToken', authData[0].loginToken);
              window.localStorage.setItem('focused_app4Tr12_theUserSlug', authData[0].the_user_slug);
              window.localStorage.setItem('focused_app4Tr12__theUserTel', authData[0].tel);
              window.localStorage.setItem('focused_app4Tr12__theUserAddress', authData[0].address);
              window.localStorage.setItem('focused_app4Tr12__theUserEmail', authData[0].user_email_address);
              window.localStorage.setItem('focused_app4Tr12__theUserFname', authData[0].first_name);
              window.localStorage.setItem('focused_app4Tr12__theUserMname', authData[0].user_middle_name);
              window.localStorage.setItem('focused_app4Tr12__theUserLname', authData[0].last_name);
              window.localStorage.setItem('focused_app4Tr12__theProfileImageURL', authData[0].profile_image_url);
              window.localStorage.setItem('focused_app4Tr12__idNumber', authData[0].id_number);
              window.localStorage.setItem('focused_app4Tr12__idType', authData[0].id_type);
              window.localStorage.setItem('focused_app4Tr12__membershipCode', authData[0].membership_code);
              
              this.showSuccessMessage(authData[0].success);

              this.navCtrl.setRoot(HomePage);
            }
          }
          else
          {
            this.showErrorMessage("An error occured from server side. Please try again!");
          }
        },err => {
            this.loader.dismiss();
        })

    }

  }

  forgotPassword() {

    let alert = this.alertCtrl.create({
      title: 'Générer Mot De Passe.',
      message: 'Veuillez entrer votre adresse email, numero de téléphone ou numero de la carte d\'identité',
      inputs: [
        {
          name: 'usernameInput',
          placeholder: 'Email, téléphone ou numéro d\'identité'
        }/*,
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }*/
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            /*console.log('Cancel clicked');*/
          }
        },
        {
          text: 'Proceed',
          handler: data => {

            var username = data.usernameInput;

            this.showLoading("En train de générer le mot de passe. Veuillez patienter ...");

            this.http.get(this.apiLink+'rest_generate_one_time_password/?username='+username+'&format=json').subscribe(

                regeneratePasswordData => {

                    this.loader.dismiss();

                    if (regeneratePasswordData != '') 
                    {

                      if((regeneratePasswordData[0].regeneratePasswordData == '0')||(regeneratePasswordData[0].result == 0))
                      {
                        this.showErrorMessage(regeneratePasswordData[0].error);
                      }
                      else
                      {
                        this.showSuccessMessage(regeneratePasswordData[0].success);
                      }

                    }
                    else
                    {
                      this.showErrorMessage("Erreur de serveur. Veuillez recommencer!");
                    }

                  },
                  err => {
                    this.loader.dismiss();
                    this.showErrorMessage(err);
                  }
                )
          }
        }
      ]
    });
    alert.present();

  }

}
