import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {PlayingService} from "../../services/playing";

/*
  Generated class for the Setting page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public playingService : PlayingService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

}
