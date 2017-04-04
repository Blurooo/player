import {Artist} from "./artist";
import {Album} from "./album";
/**
 * Created by zo on 2017/3/28.
 */
export class Song{
  id : number
  name : string
  artists : Artist[]
  album : Album
  duration : number
  fee : number
  mp3Url : string
  lrc : string[]
}
