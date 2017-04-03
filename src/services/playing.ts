import {Playing} from "../providers/playing";
import {Song} from "../entity/song";
import {Injectable} from "@angular/core";
import {Observable, Observer} from "rxjs";
import {PlayInfo} from "../entity/play-info";
import {Util} from "../common/util";
import {PlayMode} from "../entity/play-mode";
import {Setting} from "../entity/setting";
/**
 * Created by zo on 2016/3/25.
 */

@Injectable()
export class PlayingService {

  private audio : any = new Audio();
  private song : Song;
  private key : string;
  private offset : number = 0;
  private curType = '1';
  private playMode = PlayMode.LoopAll;

  //实时维护当前播放信息
  private playInfo = new PlayInfo();

  //内部维护的播放列表是一个Object类型，并以id为key，主要在于此种方式可以无性能损耗地对重复对象去重。对外输出则为Array，便于Angular2遍历
  private playList = new Object();
  private playListArray : Song[] = [];

  private setting : Setting = new Setting();



  constructor(public playing : Playing, public util : Util){
    //初始化历史播放列表
    let playList : any = JSON.parse(localStorage.getItem('playList'));
    if(playList){
      this.setPlayList(playList);
    }
    //初始化配置信息
    this.initSetting();
    //初始化历史当前播放
    let play = JSON.parse(localStorage.getItem('playStatus'));
    if(play){
      this.song = play.song;
      this.playInfo = play.playInfo;
      this.playMode = play.playMode;
      this.song && this.playInfo && this.playSong(this.song, this.playInfo);
    }

  }

  private initSetting(){
    let setting : Setting = JSON.parse(localStorage.getItem('setting'));
    if(setting){
      this.setting = setting;
    }
  }

  public setAutoCrack(value ?: boolean){
    value && (this.setting.autoCrack = true);
    !value && (this.setting.autoCrack = false);
    this.persistenSetting();
  }

  public setAutoResume(value ?: boolean){
    value && (this.setting.autoResume = true);
    !value && (this.setting.autoResume = false);
    this.persistenSetting();
  }

  private persistenSetting(){
    localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  public getSetting(){
    return this.setting;
  }

  //获得播放列表，实质上返回的是用以遍历的Array类型
  public getPlayList() : Song[]{
    return this.playListArray;
  }

  //设置播放列表，会自动维护Array型播放列表
  private setPlayList(playList : any){
    this.playList = playList;
    for(let key in this.playList){
      this.playListArray.push(this.playList[key]);
    }
  }


  public getVolume() : string{
    if(!this.playInfo.volumePercent){
      return '100%';
    }
    return this.playInfo.volumePercent;
  }

  public seek(percent : number){
    //消除不合理数据，起到错误防护作用
    percent > 1 && (percent = 1);
    percent < 0 && (percent = 0);
    this.audio.currentTime = this.audio.duration * percent;
  }

  public changePlayMode(){
    (this.playMode === PlayMode.Random && (this.playMode = PlayMode.LoopAll))
    || (this.playMode === PlayMode.LoopAll && (this.playMode = PlayMode.LoopOne))
    || (this.playMode === PlayMode.LoopOne && (this.playMode = PlayMode.Random));
    this.persistentPlayStatus();
  }

  public getPlayMode(){
    return this.playMode;
  }

  private persistentPlayStatus(){
    localStorage.setItem('playStatus', JSON.stringify({playInfo : this.playInfo, song : this.song, playMode : this.playMode}));
  }

  private persistentPlayList(){
    localStorage.setItem('playList', JSON.stringify(this.playList));
  }

  //添加新歌曲到播放列表
  public addSongToPlayList(song : Song){
    //添加未存在于列表中的歌曲时，增加到列表并持久化
    if(!this.playList[song.id]){
      this.playList[song.id] = song;
      this.playListArray.push(song);
      this.persistentPlayList();
    }
  }

  //删除播放列表某项
  public delSong(index : number){
    if(index >=0 && index < this.playListArray.length){
      let delTmp : Song[] = this.playListArray.splice(index, 1);
      delete this.playList[delTmp[0].id];
      this.persistentPlayList();
    }
  }

  //通过歌曲id播放该歌曲
  public play(song : Song){
    if(this.getPlayingSong() && this.getPlayingSong().id === song.id){
      if(!this.isPlaying()){
        this.resume();
      }
      return;
    }
    this.resetPlaying(song).subscribe((volume : number) => {
      let resume = false;
      if(this.isPlaying()){
        this.audio.pause();
        resume = true;
      }
      this.playing.getDetailById(song.id, this.setting.autoCrack).subscribe(song => {
        this.playInfo.song = song;
        if(song.fee > 0){
          if(!this.setting.autoCrack){
            this.util.confirm(`该歌曲需要付费${song.fee}元，是否启动自动破解？`).subscribe(res => {
              !res && resume && this.resume(volume);
              if(res){
                this.setAutoCrack(true);
                this.playSong(song);
                this.audio.oncanplay = () => {
                  this.fadeIn(volume, 10).subscribe();
                }
              }
            });
          }else{
            this.playSong(song);
            this.audio.oncanplay = () => {
              this.fadeIn(volume, 10).subscribe();
            }
          }
        }else{
          this.playSong(song);
          this.audio.oncanplay = () => {
            this.fadeIn(volume, 10).subscribe();
          }
        }
      })
    });
  }

  //播放下一首，方法供内部调配（播放结束自动切换下一首）或用户发起（点击下一首），用户发起为强制行为必然切换，内部调配为非强制行为需要根据当前播放模式决定。
  public next(force ?: boolean){
    if(!this.song){
      return;
    }
    if(this.playMode === PlayMode.LoopOne && !force){
      this.play(this.song);
      return;
    }else if(this.playMode === PlayMode.Random && !force){
      let next = Math.round(Math.random() * (this.playListArray.length - 1));
      this.play(this.playListArray[next]);
      return;
    }
    let index = this.playListArray.findIndex((song : Song) => {
      return song.id === this.song.id;
    });
    let next = index < this.playListArray.length - 1 ? index + 1 : 0;
    this.play(this.playListArray[next]);
    return;
  }

  //播放上一曲，必然都是用户的强制操作
  public last(){
    if(!this.song){
      return;
    }
    let index = this.playListArray.findIndex((song : Song) => {
      return song.id === this.song.id;
    });
    let last = index === 0 ? this.playListArray.length - 1 : index - 1;
    this.play(this.playListArray[last]);
  }

  //重置现场，包括进度条置零，播放时间置零，歌曲播放声音淡出，暂停播放中歌曲。返回一个携带上次播放声音的可观察对象，应当在播放时恢复它
  private resetPlaying(song : Song) : Observable<number>{
    return Observable.create((observer : Observer<number>) => {
      this.playInfo.currentTime = 0;
      this.playInfo.process = '0%';
      this.playInfo.duration = song.duration / 1000;
      this.fadeOut().subscribe((volume : number) => {
        observer.next(volume);
      });
    });
  }

  //声音淡出，返回一个携带上次音量大小的可观察对象
  private fadeOut(per ?: number) : Observable<number>{
    let lastVolume : number = this.audio.volume;
    return Observable.create((observer : Observer<number>) => {
      let min = setInterval(() => {
        this.audio.volume = this.audio.volume.toFixed(2);
        (this.audio.volume >= 0.01 && (this.audio.volume -= 0.01)) || (this.audio.volume = 0);
        if(this.audio.volume === 0){
          clearInterval(min);
          observer.next(lastVolume);
        }
      }, per || 5);
    });
  }

  //声音淡入，返回一个携带当前音量大小的可观察对象
  private fadeIn(lastVolume : number, per ?: number) : Observable<number>{
    this.audio.volume = 0;
      return Observable.create((observer : Observer<number>) => {
        let max = setInterval(() => {
          (this.audio.volume < lastVolume - 0.01 && (this.audio.volume += 0.01)) || (this.audio.volume = lastVolume);
          if(this.audio.volume === lastVolume){
            clearInterval(max);
            observer.next(lastVolume);
          }
        }, per || 5);
    });
  }

  //实际播放音乐的逻辑，带playInfo时表明为恢复播放现场，默认只恢复不自动播放，除非autoPlay为true时
  public playSong(song : Song, playInfo ?: PlayInfo){
    if(this.setting.autoCrack === undefined) this.initSetting();
    this.song = song;
    this.audio.src = song.mp3Url;
    this.audio.ontimeupdate = () => {
      this.playInfo.currentTime = this.audio.currentTime;
      this.playInfo.duration = this.audio.duration;
      this.playInfo.volume = this.audio.volume;
      this.playInfo.process = (this.audio.currentTime / this.audio.duration) * 100 + '%';
      this.persistentPlayStatus();
    }
    this.audio.oncanplay = () => {
    }
    this.audio.onended = () => {
      this.next();
    }
    if(playInfo){
      this.audio.volume = this.playInfo.volume;
      this.audio.currentTime = this.playInfo.currentTime;
      if(this.setting.autoResume){
        this.audio.play();
      }
    }else{
      this.audio.play();
      this.addSongToPlayList(song);
    }
  }

  //暂停播放，正常情况下暂停时使用淡出，但可以强制直接暂停
  public pause(force ?: boolean){
    if(force){
      this.audio.pause();
      return;
    }
    this.fadeOut().subscribe((volume : number) => {
      this.audio.pause();
      this.audio.volume = volume;
    });
  }

  //恢复播放
  public resume(volume ?: number){
    this.audio.play();
    this.fadeIn(volume || this.audio.volume).subscribe();
  }

  //改变播放状态，播放时暂停，暂停或停止状态时播放
  public changePlayStatus(){
    if(this.isPlaying()){
      this.pause();
    }else{
      if(!this.getPlayingSong()) return;
      this.resume();
    }
  }

  //通过关键字查找资源，资源可以是歌曲、歌手等，只返回一个携带至多10条记录的可观察对象。关键字为空时直接返回一个携带空数组的可观察对象
  public searchSongsByKey(key : string, type ?: string) : Observable<Song[]>{
    this.key = key.trim();
    this.offset = 0;
    if(type) this.curType = type;
    if(!this.key) return Observable.create((observer : Observer<Song[]>) => {
      observer.next([]);
    });
    return this.playing.searchSongsByKey(key, this.curType);
  }

  //当已经调用过搜索关键字的方法时，可以继续调用此方法获取下一页，页码由内部维护，外部不需要关心。
  public loadMoreSearchResult() : Observable<Song[]>{
    if(!this.key)  return Observable.create((observer : Observer<Song[]>) => {
      observer.next([]);
    });
    this.offset += 10;
    return this.playing.searchSongsByKey(this.key, this.curType, this.offset);
  }

  //更改关键字搜索类型
  public changeType(type : string) : Observable<Song[]>{
    return this.searchSongsByKey(this.key, type);
  }

  //获取当前播放中的歌曲对象，包括暂停态、停止态和播放态。
  public getPlayingSong() : Song{
    return this.song;
  }

  //获取当前歌曲的播放信息
  public getPlayInfo() : PlayInfo{
    return this.playInfo;
  }

  //当前是否正在播放
  public isPlaying(){
    return this.audio.played && !this.audio.paused;
  }

  //更改当前播放音量，取值0-1
  public changeVolume(volume : number){
    //消除不合理数据，起到错误防护作用
    volume > 1 && (volume = 1);
    volume < 0 && (volume = 0);
    this.audio.volume = volume;
    this.playInfo.volume = volume;
    this.playInfo.volumePercent = volume * 100 + '%';
    this.persistentPlayStatus();
  }

  //获取当前搜索的搜索类型
  public getCurType(){
    return this.curType;
  }
}
