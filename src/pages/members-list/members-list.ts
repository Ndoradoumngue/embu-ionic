import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import Swal from 'sweetalert2';

import { MemberDetailsPage } from '../../pages/member-details/member-details';

@Component({
  selector: 'page-members-list',
  templateUrl: 'members-list.html',
})
export class MembersListPage {

  @ViewChild('searchQuery') customSearch;

  public apiLink: any;
  public loader: any;
  public usersData: any;

  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public loadingControl: LoadingController) {

  	this.apiLink = "https://focus-agency.herokuapp.com/"; 	

  }

  ionViewDidLoad() {
  	this.getUsersList();
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

  getUsersList() {

  	this.showLoading("Loading user, please wait...");

  	var customQuery = this.customSearch.value;
  	var user_slug = window.localStorage.getItem('focused_app4Tr12_theUserSlug');
    var current_token = window.localStorage.getItem('focused_app4Tr12__loginToken');

  	this.http.get(this.apiLink+'rest_get_users_list/?user_slug='+user_slug+'&token='+current_token+'&custom_search='+customQuery+'&format=json').subscribe(

  		usersData => {

  			this.loader.dismiss();

  			this.usersData = usersData;
  			
  		},err => {
  			this.loader.dismiss();
  			this.showErrorMessage('An error occured. Please check your internet connection and try again!');
		})  

  }

  viewUser(userSlug: string) {

    this.navCtrl.push(MemberDetailsPage, {
    	'userToViewSlug': userSlug
    });
  }

}
