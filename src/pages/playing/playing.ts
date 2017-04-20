import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams} from 'ionic-angular';
import {SearchPage} from "../search/search";
import {Util} from "../../common/util";
import {PlayingService} from "../../services/playing";
import {LovePage} from "../love/love";
import {PlayMode} from "../../entity/play-mode";
import {SettingPage} from "../setting/setting";


@Component({
  selector: 'page-playing',
  templateUrl: 'playing.html'
})
export class PlayingPage implements AfterViewInit{

  @ViewChild(Content)
  content : Content;

  volumeTmp : number = 0;

  pushOption : any = {
    animate : true,
    animation : 'md-transition',
    direction : 'forward'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public playingService : PlayingService, public util : Util) {

  }

  ngAfterViewInit(){
    this.playingService.registerLrcUptateListener(this.scrollLrc);
  }

  scrollLrc = () => {
    this.content.scrollTo(0, this.playingService.getCurLrcIndex() >= 2 ? (this.playingService.getCurLrcIndex() - 1) * 20 : 0);
  }
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

  getTime(ls : string) : string{
    if(!ls) return '0';
    return ls.split(']')[0];
  }

  getLrc(ls : string) : string{
    if(!ls) return '';
    return ls.split(']')[1].trim();
  }
}
