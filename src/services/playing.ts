import {Playing} from "../providers/playing";
import {Song} from "../entity/song";
import {Injectable} from "@angular/core";
/**
 * Created by zo on 2016/3/25.
 */

@Injectable()
export class PlayingService{

  private audio : any = new Audio();
  private song : Song;

  constructor(public playing : Playing){

  }


  play(id : number){
    this.playing.getDetailById(id).subscribe(song => {
      this.song = song;
      this.audio.src = song.mp3Url;
      this.audio.play();
    })
  }

  searchSongsByKey(key : string){
    return this.playing.searchSongsByKey(key);
  }
}
