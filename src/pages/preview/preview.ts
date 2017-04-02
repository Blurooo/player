import {Component, Input} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Song} from "../../entity/song";
import {PlayingService} from "../../services/playing";
import {PlayingPage} from "../playing/playing";

/*
  Generated class for the Preview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html'
})
export class PreviewPage {


  @Input()
  song : Song;

  constructor(public navCtrl: NavController, public navParams: NavParams, public playingService : PlayingService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewPage');
  }

  changePlayStatus(){
    this.playingService.changePlayStatus();
  }

  goPlaying(){
    this.navCtrl.push(PlayingPage, null, {
      animate : true,
      animation : 'md-transition',
      direction : 'forward'
    })
  }

}
