import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Song} from "../../entity/song";
import {PlayingService} from "../../services/playing";

/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {


  songs : Song[];
  autofocus : boolean = false;
  hasMore : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public playingService : PlayingService) {
    if(playingService.getLastKey()){
      this.search(playingService.getLastKey());
    }
  }

  ionViewDidLoad() {
    this.autofocus = true;
  }

  search(key : string){
    this.playingService.searchSongsByKey(key).subscribe((songs : Song[]) => {
      if(songs) this.hasMore = true;
      this.songs = songs;
    })
  }

  loadMore(infiniteScroll){
    this.playingService.loadMoreSearchResult().subscribe((songs : Song[]) => {
      if(!songs) this.hasMore = false;
      Array.prototype.push.apply(this.songs, songs);
      infiniteScroll.complete();
    });
  }

  //暂时封闭除搜索歌曲外的功能
  changeType(type : string){
    if(type != '1') return;
    this.playingService.changeType(type).subscribe((songs : Song[]) => {
      this.songs = songs;
    });
  }
}
