import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import Swal from 'sweetalert2';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DepositPage } from '../pages/deposit/deposit';
import { WithdrawPage } from '../pages/withdraw/withdraw';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { MembersListPage } from '../pages/members-list/members-list';
import { RegisterMemberPage } from '../pages/register-member/register-member';
import { BalanceInquiryPage } from '../pages/balance-inquiry/balance-inquiry';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = HomePage;

  public rootPage: any;
  public loader: any;
  public apiLink: any;
  public userFullName: any;
  public userImage: any;

  pages: Array<{title: string, component: any, icon: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public loadingControl: LoadingController) {
    this.initializeApp();

    this.apiLink = "https://focus-agency.herokuapp.com/";

    // window.localStorage.setItem('focused_app4Tr12__user_is_logged', 'false');

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'Member Registration', component: RegisterMemberPage, icon: 'add' },
      { title: 'Search Member', component: MembersListPage, icon: 'person' },
      { title: 'Deposit', component: DepositPage, icon: 'card' },
      { title: 'Withdraw', component: WithdrawPage, icon: 'cash' },
      { title: 'Balance Inquirie', component: BalanceInquiryPage, icon: 'pricetag' },
      { title: 'Change Password', component: ChangePasswordPage, icon: 'lock' }
    ];

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

    this.userFullName = window.localStorage.getItem('focused_app4Tr12__user_full_name');

    var user_profile_image = window.localStorage.getItem('focused_app4Tr12__profile_image_url');

    if ((user_profile_image == null)||(user_profile_image == 'null')||(user_profile_image == '')||(user_profile_image == undefined)||(user_profile_image == 'undefined')) {
      window.localStorage.setItem('focused_app4Tr12__profile_image_url', 'empty');
    }

    this.userImage = window.localStorage.getItem('focused_app4Tr12__profile_image_url');

  }

  showLoading() {
    this.loader = this.loadingControl.create({
      content: "Authenticating, please wait..."
    });

    this.loader.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.showLoading();

      var isLogged = window.localStorage.getItem('focused_app4Tr12__user_is_logged');

      if(isLogged == 'true') {
        this.rootPage = HomePage;
      }
      else
      {
        this.rootPage = LoginPage;
      }

      this.loader.dismiss();

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {

    Swal.fire({
      title: 'Logout',
      text: 'Do you want to logout?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {

          window.localStorage.setItem('focused_app4Tr12__user_is_logged', 'false');
          this.nav.setRoot(LoginPage);

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
