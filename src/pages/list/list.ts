import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {PlayingPage} from "../playing/playing";
import {Song} from "../../entity/song";

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  go(){
    this.navCtrl.push(PlayingPage);
  }

  search(){
    console.log('搜索');
  }

  addToLove(song : Song){
    console.log('添加');
  }

}
