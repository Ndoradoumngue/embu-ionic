import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Market } from '@ionic-native/market';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import { LoginPage } from '../../pages/login/login';
import { TopupPage } from '../../pages/topup/topup';
import { DepositPage } from '../../pages/deposit/deposit';
import { WithdrawPage } from '../../pages/withdraw/withdraw';
import { MembersListPage } from '../../pages/members-list/members-list';
import { RegisterMemberPage } from '../../pages/register-member/register-member';
import { BalanceInquiryPage } from '../../pages/balance-inquiry/balance-inquiry';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public loader: any;
  public apiLink: any;
  public userData: any;
  public tokenExpired: any;
  public accountFetchLoop: any;
  public tokenRenewalLoop: any;
  
  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public  loadingControl: LoadingController, public market: Market, private alertCtrl: AlertController) {

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
  		this.getAgentAccountList();
  		this.launchAccountFetchLoop();
  		this.checkAppVersion();
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

  checkAppVersion() {

    var appInstalledVersion = '0.0.6';

    this.http.get(this.apiLink+'rest_test_app_version/?format=json').subscribe(

      appVersionData => {

        if(appVersionData[0].current_version != appInstalledVersion)
        {
          Swal.fire({
            title: 'New App update',
            text: 'Please update your app!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update!',
            cancelButtonText: 'I will update later!'
          }).then((result) => {
            if (result.value) {

              // window.open('http://play.google.com/store/apps/details?id=com.embusaccoagent.com', '_system');

              this.market.open('com.embusaccoagent.com');


            } else if (result.dismiss === Swal.DismissReason.cancel) {
              /*Swal(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
              )*/
            }
          })

        }

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

  getAgentAccountList() {

  	var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
    var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

    this.http.get(this.apiLink+'rest_get_user_details/?token='+current_token+'&user_slug='+user_slug+'&user_to_view_slug='+user_slug+'&format=json').subscribe(

        userData => {

            this.userData = userData;

        },
    err => {
        /*this.presentAlert("Error", err);*/
    })

  }

  launchAccountFetchLoop() {

    this.accountFetchLoop = setInterval(() => {

    	if(this.tokenExpired == 'true')
    	{
    		clearInterval(this.accountFetchLoop);
    	}
    	else
    	{
    		this.getAgentAccountList();
    	}

    }, 10000);

  }

  goToMemberRegistration() {
  	this.navCtrl.push(RegisterMemberPage);
  }

  goToMembersList() {
    this.navCtrl.push(MembersListPage);
  }

  goToBalanceInquiry() {
    this.navCtrl.push(BalanceInquiryPage);
  }

  goToTopup() {
    this.navCtrl.push(TopupPage);
  }

  goToDeposit(amountInAgentAccount: string) {
  	this.navCtrl.push(DepositPage, {
  		'agentFloat': amountInAgentAccount,
  		});
  }

  goToWithdraw() {
  	// this.navCtrl.push(WithdrawPage);
    this.showInformationMessage('This service is not yet available!');
  }

  requestNewPassword() {

    /*
    const userMembershipCode = Swal.fire({
      title: 'New Password Request',
      input: 'text',
      inputPlaceholder: 'Input the user membership code'
    })

    if (userMembershipCode) {
      this.proceedToNewPasswordRequest(userMembershipCode);
    }
    */





    let alert = this.alertCtrl.create({
      title: 'Request New Password.',
      message: 'Input the user membership code',
      inputs: [
        {
          name: 'userMembershipCode',
          placeholder: 'Membership Code'
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

            this.proceedToNewPasswordRequest(data.userMembershipCode);

          }
        }
      ]
    });
    alert.present();





  }

  proceedToNewPasswordRequest(userMembershipCode) {

    var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
    var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

    this.showLoading("Processing, please wait...");

    this.http.get(this.apiLink+'rest_request_new_password/?token='+current_token+'&user_slug='+user_slug+'&user_membership_code='+userMembershipCode+'&format=json').subscribe(

      newPasswordRequestData => {

        this.loader.dismiss();

        if(newPasswordRequestData[0].result == '0')
        {
          this.showErrorMessage(newPasswordRequestData[0].error);
        }
        else
        {
          this.showSuccessMessage(newPasswordRequestData[0].success);
        }

    },
    err => {
      this.loader.dismiss();
    })

  }

}
