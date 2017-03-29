import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {PlayingPage} from "../pages/playing/playing";
import {Playing} from "../providers/playing";
import {Apis} from "../common/Apis";
import {PlayingService} from "../services/playing";
import {ListPage} from "../pages/list/list";
import {BackDirective} from "../directives/back.directive";
import {SearchPage} from "../pages/search/search";
import {LovePage} from "../pages/love/love";

@NgModule({
  declarations: [
    MyApp,
    PlayingPage,
    ListPage,
    SearchPage,
    LovePage,
    BackDirective
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlayingPage,
    ListPage,
    LovePage,
    SearchPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Playing,
    Apis,
    PlayingService
  ]
})
export class AppModule {}
