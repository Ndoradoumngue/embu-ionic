import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-member-details',
  templateUrl: 'member-details.html',
})
export class MemberDetailsPage {

  public apiLink: any;
  public loader: any;
  public userData: any;

  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public loadingControl: LoadingController) {

  	this.apiLink = "https://focus-agency.herokuapp.com/"; 	

  }

  ionViewDidLoad() {
  	this.getUserDetails();
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

  getUserDetails() {

  	this.showLoading("Loading user details, please wait...");

  	var userToViewSlug = this.navParams.get('userToViewSlug');

  	var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
    var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

  	this.http.get(this.apiLink+'rest_get_user_details/?user_slug='+user_slug+'&token='+current_token+'&user_to_view_slug='+userToViewSlug+'&format=json').subscribe(

  		userData => {

  			this.loader.dismiss();

  			this.userData = userData;
  			
  		},err => {
  			this.loader.dismiss();
  			this.showErrorMessage('An error occured. Please check your internet connection and try again!');
		})  

  }

}
