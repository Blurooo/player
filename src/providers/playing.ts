import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {Song} from "../entity/song";
import {Apis} from "../common/Apis";

/*
  Generated class for the Playing provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Playing {

  type : any = {
    song : '1',         //单曲
    album : '100',      //专辑
    artist : '1000',    //歌手
    user : '1002'       //用户
  }


  constructor(public http: Http, public apis : Apis) {
    console.log('Hello Playing Provider');
  }


  public searchSongsByKey(key : string, type ?: string, offset ?: number) : Observable<Song[]>{
    return this.http.post(`${this.apis.searchSongsByKey}?s=${key}&type=${type || this.type.song}&limit=10&offset=${offset || 0}`, null)
      .map(this.extraData)
      .map((res : any) => res.result.songs);
  }

  public getDetailById(id : number) : Observable<Song>{
    return this.http.get(`${this.apis.getDetailById}?id=${id}&ids=[${id}]`)
      .map(this.extraData)
      .map((res : any) => res.songs[0]);
  }

  extraData(res : Response){
    return res.json();
  }

}
