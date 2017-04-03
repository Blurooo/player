import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SearchPage} from "../search/search";
import {Util} from "../../common/util";
import {PlayingService} from "../../services/playing";
import {ListPage} from "../list/list";
import {LovePage} from "../love/love";
import {PlayMode} from "../../entity/play-mode";
import {SettingPage} from "../setting/setting";

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

  volumeTmp : number = 0;

  pushOption : any = {
    animate : true,
    animation : 'md-transition',
    direction : 'forward'
  }

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
    this.navCtrl.push(SearchPage, null, this.pushOption);
  }

  goList(){
    this.navCtrl.push(LovePage, null, this.pushOption);
  }

  goSetting(){
    this.navCtrl.push(SettingPage, null, this.pushOption);
  }

  getPlayModeString(){
    let mode = this.playingService.getPlayMode();
    return mode === PlayMode.LoopAll ? 'loop-all' : mode === PlayMode.LoopOne ? 'loop-one' : mode === PlayMode.Random ? 'random' : '';
  }

  changeVolume(volume){
    this.playingService.changeVolume(volume);
  }

  seek(percent, mute){
    percent && this.playingService.seek(percent);
  }

  seekStart(){
    this.playingService.pause(true);
  }

  seekEnd(){
    this.playingService.resume();
  }

  drag(e, name){
    console.log(e, name);
  }
}
