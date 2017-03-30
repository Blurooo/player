import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Playing} from "../../providers/playing";
import {ListPage} from "../list/list";
import {SearchPage} from "../search/search";
import {Util} from "../../common/util";

/*
  Generated class for the Playing page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-playing',
  templateUrl: 'playing.html'
})
export class PlayingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public playing : Playing, public util : Util) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayingPage');
  }

  play(){
    this.navCtrl.push(SearchPage, null, {
      animate : true,
      animation : 'md-transition',
      direction : 'forward'
    });
  }

}
