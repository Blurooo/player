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

  constructor(public navCtrl: NavController, public navParams: NavParams, public playingService : PlayingService) {}

  ionViewDidLoad() {
    this.playingService.searchSongsByKey('晚晴').subscribe((songs : Song[]) => {
      this.songs = songs;
    })
  }

  search(key : string){
    this.playingService.searchSongsByKey(key).subscribe((songs : Song[]) => {
      this.songs = songs;
    })
  }

}
