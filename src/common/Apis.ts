/**
 * Created by zo on 2017/3/28.
 */

import {Injectable} from "@angular/core";

@Injectable()
export class Apis{
  searchSongsByKey : string = '/api/search/get/web';
  getDetailById : string = '/api/song/detail';

  crackSongsById : string = 'http://music.163.com/song/media/outer/url?id=%s.mp3';
}
