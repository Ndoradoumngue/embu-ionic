import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
// import { Printer } from '@ionic-native/printer/ngx';

import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-register-member',
  templateUrl: 'register-member.html',
})
export class RegisterMemberPage {

  public loader: any;
  public apiLink: any;
  public agentAvailableFloat: any;
  public tokenExpired: any;
  public tokenRenewalLoop: any;

  @ViewChild('memberNumber') userMemberNumber;
  @ViewChild('firstName') userFirstName; 
  @ViewChild('lastName') userLastName;
  @ViewChild('IDNumber') userIDNumber;
  @ViewChild('TelNumber') userTelNumber;
  
  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public  loadingControl: LoadingController) {

  	this.apiLink = "https://focus-agency.herokuapp.com/";

  	this.agentAvailableFloat = this.navParams.get("agentFloat");

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

  register() {

  	var memberNumber = this.userMemberNumber.value;
    var firstName = this.userFirstName.value;
    var lastName = this.userLastName.value;
    var IDNumber = this.userIDNumber.value;
    var TelNumber = this.userTelNumber.value;

    if((memberNumber == '')||(firstName == '')||(lastName == '')||(IDNumber == '')||(TelNumber == ''))
    {
    	this.showErrorMessage("Please enter the member details to proceed.");
    }
    else
    {
    	var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
    	var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

    	this.showLoading("Processing, please wait...");

    	this.http.get(this.apiLink+'rest_register_member/?user_slug='+user_slug+'&token='+current_token+'&member_number='+memberNumber+'&first_name='+firstName+'&last_name='+lastName+'&id_number='+IDNumber+'&tel_number='+TelNumber+'&format=json').subscribe(

    		memberRegistrationData => {

    			this.loader.dismiss();

    			if(memberRegistrationData != '') {

    				if((memberRegistrationData[0].result == '0')||(memberRegistrationData[0].result == 0))
    				{
    					this.showErrorMessage(memberRegistrationData[0].error);
    				}
    				else
    				{
		                this.userMemberNumber.value = '';
		                this.userFirstName.value = '';
		                this.userLastName.value = '';
		                this.userIDNumber.value = '';
		                this.userTelNumber.value = '';

		                this.showSuccessMessage(memberRegistrationData[0].success);
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

/*

  printReceipt(){

    this.printer.isAvailable().then(function(){
      this.printer.print("https://www.techiediaries.com").then(function(){
        this.showSuccessMessage("printing done successfully !");
      },function(){
        this.showErrorMessage("Error while printing !");
      });
      }, function(){
        this.showErrorMessage("Printing is unavailable on your device !");
    });

}

*/

}
