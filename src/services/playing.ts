import {Playing} from "../providers/playing";
import {Song} from "../entity/song";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
/**
 * Created by zo on 2016/3/25.
 */

@Injectable()
export class PlayingService{

  private audio : any = new Audio();
  private song : Song;
  private key : string;
  private offset : number = 0;
  private curType = '1';

  private playinfo;



  constructor(public playing : Playing){

  }


  play(id : number){
    this.playing.getDetailById(id).subscribe(song => {
      this.song = song;
      this.audio.src = song.mp3Url;
      this.audio.play();
      this.audio.ontimeupdate = (res, res2) => {
        console.log('更改位置', res, res2);
      }
    })
  }

  pause(){
    this.audio && this.audio.isPlaying && this.audio.pause();
  }

  searchSongsByKey(key : string) : Observable<Song[]>{
    this.key = key;
    this.offset = 0;
    return this.playing.searchSongsByKey(key, this.curType);
  }

  loadMoreSearchResult() : Observable<Song[]>{
    this.offset += 10;
    return this.playing.searchSongsByKey(this.key, this.curType, this.offset);
  }

  changeType(type : string) : Observable<Song[]>{
    this.curType = type;
    return this.searchSongsByKey(this.key);
  }

  accessPlayingSong() : Song{
    return this.song;
  }
}
