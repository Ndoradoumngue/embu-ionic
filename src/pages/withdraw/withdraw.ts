import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  public loader: any;
  public apiLink: any;
  public tokenExpired: any;
  public tokenRenewalLoop: any;

  @ViewChild('accountNumber') withdrawFromAccountNumber;
  @ViewChild('amount') amountToWithdraw; 
  @ViewChild('agentPassword') agentPassword;
  @ViewChild('clientPassword') clientPassword;
  
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

  proceedToWithdrawal() {

  	var accountNumberToWithdrawFrom = this.withdrawFromAccountNumber.value;
    var amountToWithdraw = this.amountToWithdraw.value;
    var typedAgentPassword = this.agentPassword.value;
    var typedClientPassword = this.clientPassword.value;

    if((accountNumberToWithdrawFrom == '')||(amountToWithdraw == '')||(typedAgentPassword == '')||(typedClientPassword == ''))
    {
    	this.showErrorMessage("Please enter the client account number, the amount to deposit and your password to proceed.");
    }
    else
    {
    	var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
    	var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

    	this.showLoading("Processing, please wait...");

    	this.http.get(this.apiLink+'rest_make_withdrawal/?user_slug='+user_slug+'&token='+current_token+'&account_number_to_withdraw_from='+accountNumberToWithdrawFrom+'&amount_to_withdraw='+amountToWithdraw+'&agent_password='+typedAgentPassword+'&client_password='+typedClientPassword+'&format=json').subscribe(

    		withdrawalData => {

    			this.loader.dismiss();

    			if(withdrawalData != '') {

    				if((withdrawalData[0].result == '0')||(withdrawalData[0].result == 0))
    				{
    					this.showErrorMessage(withdrawalData[0].error);
    				}
    				else
    				{
              this.withdrawFromAccountNumber.value = '';
              this.amountToWithdraw.value = '';
              this.agentPassword.value = '';
              this.clientPassword.value = '';

    					this.showSuccessMessage(withdrawalData[0].success);
              window.open(this.apiLink+'bill/?transaction_code='+withdrawalData[0].transaction_code, '_system');
    				}
   				}
   				else
    			{
    				this.showErrorMessage("An error occured from server side. Please try again!");
    			}
    		},err => {
    			this.loader.dismiss();
    		}
    	)
    	
    }

  }

}
