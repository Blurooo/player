import {Component, Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";
import {Observable, Observer} from "rxjs";

/*
  Generated class for the Util provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Util {

  constructor(public alertCtrl : AlertController) {
  }


  //将音乐播放进度转化为用于显示的mm:ss形式
  translatePlayingTime(number) : string{
    let ret = ''
    number = Math.round(number);
    let m = Math.floor(number / 60);
    (m < 10) && (ret += '0');
    ret += m + ':';
    let s = number % 60;
    s < 10 && (ret += '0');
    ret += s;
    return ret;
  }


  alert(content : string, title ?: string, buttonText ?: string) : Observable<any>{
    return Observable.create((observer : Observer<any>) => {
      let alert = this.alertCtrl.create({
        title: title || '消息',
        subTitle: content || '消息通知',
        buttons: [{
          text: buttonText || '确认',
          handler : () => {
            observer.next(true);
          }
        }],
        mode: 'ios'
      });
      alert.present();
    });
  }

  confirm(content : string, title ?: string) : Observable<any>{
    return Observable.create((observer : Observer<any>) => {
      let confirm = this.alertCtrl.create({
        title: title || '确认操作',
        subTitle: content || '请确认您的操作',
        buttons: [{
          text: '取消',
          handler: () => {
            observer.next(false);
          }
        },{
          text : '确认',
          handler : () => {
            observer.next(true);
          }
        }],
        mode: 'ios'
      });
      confirm.present();
    })
  }
}
