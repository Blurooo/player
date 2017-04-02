import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SearchPage} from "../search/search";
import {Util} from "../../common/util";
import {PlayingService} from "../../services/playing";
import {ListPage} from "../list/list";
import {LovePage} from "../love/love";
import {PlayMode} from "../../entity/play-mode";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public playingService : PlayingService, public util : Util) {}

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

  mute(){
    this.playingService.changeVolume(0);
  }

  loud(){
    this.playingService.changeVolume(1);
  }

  goSearch(){
    this.navCtrl.push(SearchPage, null, {
      animate : true,
      animation : 'md-transition',
      direction : 'forward'
    })
  }

  goList(){
    this.navCtrl.push(LovePage, null, {
      animate : true,
      animation : 'md-transition',
      direction : 'forward'
    })
  }

  getPlayModeString(){
    let mode = this.playingService.getPlayMode();
    return mode === PlayMode.LoopAll ? 'loop-all' : mode === PlayMode.LoopOne ? 'loop-one' : mode === PlayMode.Random ? 'random' : '';
  }

  changeVolume(volume){
    this.playingService.changeVolume(volume);
  }

  seek(percent, e){
    console.log(e);
    this.playingService.seek(percent);
  }
}
