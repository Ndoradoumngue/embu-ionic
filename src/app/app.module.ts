import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Market } from '@ionic-native/market';
import { Printer } from '@ionic-native/printer';
import { InAppBrowser } from "@ionic-native/in-app-browser";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DepositPage } from '../pages/deposit/deposit';
import { WithdrawPage } from '../pages/withdraw/withdraw';
import { LoginPage } from '../pages/login/login';
import { TopupPage } from '../pages/topup/topup';
import { TransactionsListPage } from '../pages/transactions-list/transactions-list';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { MembersListPage } from '../pages/members-list/members-list';
import { RegisterMemberPage } from '../pages/register-member/register-member';
import { BalanceInquiryPage } from '../pages/balance-inquiry/balance-inquiry';
import { MemberDetailsPage } from '../pages/member-details/member-details';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DepositPage,
    WithdrawPage,
    TopupPage,
    LoginPage,
    TransactionsListPage,
    ChangePasswordPage,
    MembersListPage,
    RegisterMemberPage,
    BalanceInquiryPage,
    MemberDetailsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DepositPage,
    WithdrawPage,
    TopupPage,
    LoginPage,
    TransactionsListPage,
    ChangePasswordPage,
    MembersListPage,
    RegisterMemberPage,
    BalanceInquiryPage,
    MemberDetailsPage
  ],
  providers: [
    StatusBar,
    Market,
    Printer,
    InAppBrowser,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
