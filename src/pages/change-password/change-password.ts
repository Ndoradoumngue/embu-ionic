import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  public loader: any;
  public apiLink: any;
  public tokenExpired: any;
  public tokenRenewalLoop: any;

  @ViewChild('oldPassword') userOldPassword;
  @ViewChild('newPassword') userNewPassword; 
  @ViewChild('confirmNewPassword') userNewPasswordConfirmation;
  
  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public  loadingControl: LoadingController) {

  	this.apiLink = "https://focus-agency.herokuapp.com/";

  	var storedTokenExpired = window.localStorage.getItem('focused_app4Tr12__tokenExpired');
  	if(storedTokenExpired == 'true')
  	{
  		this.tokenExpired = 'true';
  		window.localStorage.setItem('focused_app4Tr12__user_is_logged', 'false');
  		window.localStorage.setItem('focused_app4Tr12__tokenExpired', 'true');

  		this.showInformationMessage('Your session has expired. Please login to continue.');

  		this.navCtrl.setRoot(LoginPage);
  	}
  	else
  	{
	    this.launchTokenRenewal();
	    this.renewToken();
	  }

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

  ionViewDidLoad() {
    /* this.depositToAccountNumber.value = 'Here is the test'; */
  }

  renewToken() {   

    var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
    var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

    this.http.get(this.apiLink+'rest_login_token_refresh/?user_slug='+user_slug+'&token='+current_token+'&format=json').subscribe(

      tokenRenewalData => {

      	if(tokenRenewalData[0].result == '0')
      	{
      		this.tokenExpired = 'true';
  	  		window.localStorage.setItem('focused_app4Tr12__user_is_logged', 'false');
  	  		window.localStorage.setItem('focused_app4Tr12__tokenExpired', 'true');

  	  		this.showInformationMessage(tokenRenewalData[0].error);

  	  		this.navCtrl.setRoot(LoginPage);
      	}
      	else
      	{
      		this.tokenExpired = 'false';
  	  		window.localStorage.setItem('focused_app4Tr12__user_is_logged', 'true');
  	  		window.localStorage.setItem('focused_app4Tr12__tokenExpired', 'false');
  	  		window.localStorage.setItem('focused_app4Tr12__loginToken', tokenRenewalData[0].token);
      	}

        },err => {

        })

  }

  launchTokenRenewal() {

    this.tokenRenewalLoop = setInterval(() => {

    	if(this.tokenExpired == 'true')
    	{
    		clearInterval(this.tokenRenewalLoop);
    	}
    	else
    	{
    		this.renewToken();
    	}

    }, 150000);

  }

  changePassword() {

  	var oldPassword = this.userOldPassword.value;
    var newPassword = this.userNewPassword.value;
    var newPasswordConfirmation = this.userNewPasswordConfirmation.value;

    if((oldPassword == '')||(newPassword == '')||(newPasswordConfirmation == ''))
    {
    	this.showErrorMessage("Please enter your old and new password to proceed!");
    }
    else
    {
    	var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
    	var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

    	this.showLoading("Processing, please wait...");

    	this.http.get(this.apiLink+'rest_change_password/?user_slug='+user_slug+'&token='+current_token+'&old_password='+oldPassword+'&new_password='+newPassword+'&new_password_confirmation='+newPasswordConfirmation+'&format=json').subscribe(

    		passwordUpdateData => {

    			this.loader.dismiss();

    			if(passwordUpdateData != '') {

    				if((passwordUpdateData[0].result == '0')||(passwordUpdateData[0].result == 0))
    				{
    					this.showErrorMessage(passwordUpdateData[0].error);
    				}
    				else
    				{
    					this.userOldPassword.value = '';
    					this.userNewPassword.value = '';
    					this.userNewPasswordConfirmation.value = '';

    					this.showSuccessMessage(passwordUpdateData[0].success);
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

}
