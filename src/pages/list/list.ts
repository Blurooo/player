import {Component, Input} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {PlayingPage} from "../playing/playing";
import {Song} from "../../entity/song";
import {PlayingService} from "../../services/playing";
import {Setting} from "../../entity/setting";
import {Util} from "../../common/util";

/*
  Generated class for the List page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  @Input()
  songs : Song[];

  @Input()
  playList : Song[];

  @Input()
  setting : Setting;

  constructor(public navCtrl: NavController, public util : Util, public playingService : PlayingService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  go(){
    this.navCtrl.push(PlayingPage);
  }

  search(){
    console.log('搜索');
  }

  addToLove(song : Song, slide){
    this.playingService.addSongToPlayList(song);
    slide.close();
    this.util.toast('已添加到播放列表');
  }


  loadMore(infiniteScroll){
    setTimeout(() => {
      infiniteScroll.complete();
    }, 2000);
  }

  show(e){
    e.stopPropagation();
  }

  play(song : Song){
    this.navCtrl.pop({
      animate : true,
      animation : 'md-transition',
      direction : 'forward'
    });
    this.playingService.play(song);
  }

  change(e){
    console.log('改变', e);
  }

  remove(index : number){
    console.log('remove', index);
    this.playingService.delSong(index);
  }
}
