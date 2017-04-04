import {Component, Injectable} from '@angular/core';
import {AlertController, ToastController} from "ionic-angular";
import {Observable, Observer} from "rxjs";


@Injectable()
export class Util {

  constructor(public alertCtrl : AlertController, public toastCtrl : ToastController) {
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

  //将歌词格式的时间字符串转化为ms
  translateLrcTime(time : string){
    let numberTime = time.trim().split(':');
    return +numberTime[0] * 60 * 1000 + +numberTime[1] * 1000;
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

  toast(message : string, duration ?: number){
    let toast = this.toastCtrl.create({
      message : message,
      duration : duration || 2000,
      position : 'top'
    });
    toast.present();
  }
}
