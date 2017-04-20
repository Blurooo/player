import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {Song} from "../entity/song";
import {Apis} from "../common/Apis";

@Injectable()
export class Playing {



  constructor(public http: Http, public apis : Apis) {
    console.log('Hello Playing Provider');
  }


  public searchSongsByKey(key : string, type ?: string, offset ?: number) : Observable<Song[]>{
    return this.http.post(`${this.apis.searchSongsByKey}?s=${key}&type=${type || 1}&limit=10&offset=${offset || 0}`, null)
      .map(this.extraData)
      .map((res : any) => res.result.songs);
  }

  public getDetailById(id : number, crack ?: boolean) : Observable<Song>{
    return this.http.get(`${this.apis.getDetailById}?id=${id}&ids=[${id}]`)
      .map(this.extraData)
      .map((res : any) => {res.songs[0].mp3Url = this.getSongCrackById(id); return res.songs[0]});
  }

  public getSongCrackById(id : number){
    return this.apis.crackSongsById.replace('%s', id + '');
  }

  public getLrcById(id : number) : Observable<string>{
    return this.http.get(this.apis.getLrcById.replace('%s', id + ''))
      .map(this.extraData)
      .map((res : any) => {return res.lrc && res.lrc.lyric});
  }

  private extraData(res : Response){
    return res.json();
  }

}
