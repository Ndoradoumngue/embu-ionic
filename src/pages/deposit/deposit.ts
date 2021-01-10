import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
// import { Printer } from '@ionic-native/printer/ngx';

import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {

  public loader: any;
  public apiLink: any;
  public agentAvailableFloat: any;
  public tokenExpired: any;
  public tokenRenewalLoop: any;
  public clientToDepositTo: any;

  @ViewChild('memberNumber') depositMemberNumber;
  @ViewChild('accountType') depositAccountType;
  // @ViewChild('accountNumber') depositToAccountNumber;
  @ViewChild('depositMadeBy') depositMadeByClient;
  @ViewChild('amount') amountToDeposit;
  @ViewChild('password') agentPassword;
  
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

  getClientDetails() {

    var clientMemberNumber = this.depositMemberNumber.value;

    this.http.get(this.apiLink+'rest_get_user_details/?user_slug='+user_slug+'&token='+current_token+'&user_to_view_slug='+clientMemberNumber+'&format=json').subscribe(

      returnedClientData => {

        var returnedClientFName = returnedClientData[0].first_name;
        var returnedClientLName = returnedClientData[0].last_name;

        this.clientToDepositTo = returnedClientFName+' '+returnedClientLName;

        },err => {

        })

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

  makeDeposit() {

  	var memberNumberToDepositTo = this.depositMemberNumber.value;
    var accountTypeToDepositTo = this.depositAccountType.value;
    // var accountNumberToDepositTo = this.depositToAccountNumber.value;
    var depositMadeBy = this.depositMadeByClient.value;
    var accountNumberToDepositTo = 'Default';
    var amountToDeposit = this.amountToDeposit.value;
    var typedAgentPassword = this.agentPassword.value;

    if((memberNumberToDepositTo == '')||(accountTypeToDepositTo == '')||(depositMadeBy == '')||(accountNumberToDepositTo == '')||(amountToDeposit == '')||(typedAgentPassword == ''))
    {
    	this.showErrorMessage("Please enter the client account number, the amount to deposit and your password to proceed.");
    }
    else
    {
    	var user_first_name = window.localStorage.getItem('focused_app4Tr12__theUserFname');
      var user_last_name = window.localStorage.getItem('focused_app4Tr12__theUserLname');

      if ((user_first_name == null)||(user_first_name == 'null')||(user_first_name == '')||(user_first_name == undefined)||(user_first_name == 'undefined')) {
        window.localStorage.setItem('focused_app4Tr12__user_full_name', 'empty');
      }
      else
      {
        var theUserFullName = user_first_name+' '+user_last_name;
        window.localStorage.setItem('focused_app4Tr12__user_full_name', theUserFullName);
      }

      var userFullName = window.localStorage.getItem('focused_app4Tr12__user_full_name');

      Swal.fire({
      title: 'Confirmation!',
      text: 'Deposit KES '+amountToDeposit+' in '+this.clientToDepositTo+'\'s account '+memberNumberToDepositTo+' '+accountTypeToDepositTo+' account at '+userFullName+' agency!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {

          var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
          var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

          this.showLoading("Processing, please wait...");

          this.http.get(this.apiLink+'rest_make_deposit/?user_slug='+user_slug+'&token='+current_token+'&member_number_to_deposit_to='+memberNumberToDepositTo+'&account_type_to_deposit_to='+accountTypeToDepositTo+'&account_number_to_deposit_to='+accountNumberToDepositTo+'&amount_to_deposit='+amountToDeposit+'&deposit_made_by='+depositMadeBy+'&agent_password='+typedAgentPassword+'&format=json').subscribe(

            depositData => {

              this.loader.dismiss();

              if(depositData != '') {

                if((depositData[0].result == '0')||(depositData[0].result == 0))
                {
                  this.showErrorMessage(depositData[0].error);
                }
                else
                {
                  // this.depositToAccountNumber.value = '';

                  this.depositMemberNumber.value = '';
                  this.depositAccountType.value = '';
                  this.amountToDeposit.value = '';
                  this.depositMadeByClient.value = '';
                  
                  this.agentPassword.value = '';

                  this.showSuccessMessage(depositData[0].success);

                  window.open(this.apiLink+'bill/?transaction_code='+depositData[0].transaction_code, '_system');
                }
              }
              else
              {
                this.showErrorMessage("An error occured from server side. Please try again!");
              }
              },err => {
                this.loader.dismiss();
              })

          } else if (result.dismiss === Swal.DismissReason.cancel) {

            /* Swal(
              'Cancelled',
              'Your imaginary file is safe :)',
              'error'
            ) */

          }
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
