import {Directive, ElementRef, EventEmitter, Input, Output, Renderer} from "@angular/core";
import {NavController} from "ionic-angular";
/**
 * Created by zo on 2017/4/3.
 */

/**
 *
 * 指令仅用于本应用拖动需求的控件，例如进度条和音量控制条，要求有如下的dom结构：
 *
 *       <div class="process-static" (click)="seek($event.offsetX / $event.path[1].clientWidth)">
           <div class="process-dynamic" [style.width]="playingService.getPlayInfo()?.process">
              <div class="pointer" dragIt (dragItStart)="seek($event)"></div>
           </div>
         </div>

 * 其中底进度条process-static，动态进度条为其子元素，可拖动的点又为动态进度条的子元素
 *
 * 那么设置拖动点pointer指令dragIt设置为可响应拖动事件的元素，接着监听 dragItMove 事件，取到的 $event 为当前拖动位置(event.targetTouches[0].clientX)相对底进度条(event.path[2].clientWidth)的百分比
 *
 * 可用于直接设置进度.如果底进度条非100%宽度，请将dragIt设置为true，以使计算底条的偏移
 *
 * 其实除了实现常规的拖动也设想了其它细节，例如dragIt可以携带数据，并在dragItEnd事件中返回，用途？
 *
 * 拖动变换播放位置难免会因为中间的卡顿出现卡卡的音乐声  如果在拖动开始的时候声音置零或者暂时暂停播放  拖动结束则恢复  体验相对就较好  很高兴本来没时间不想优化太多体验性的东西结果还是把它做了
 *
 * 然后很高兴的又发现触发tuochmove的频率太快  导致音频seek的时候有时跟不上反应  so 又做了频率限制  每50ms内最多只触发一次
 *
 */

@Directive({
  selector : '[dragIt]'
})
export class DragItDirective{

  @Input()
  dragIt : boolean;

  @Output()
  dragItStart = new EventEmitter<any>();

  @Output()
  dragItMove = new EventEmitter<any>();

  @Output()
  dragItEnd = new EventEmitter<any>();

  canEmit : boolean = true;


  constructor(renderer : Renderer, el : ElementRef, navCtl : NavController){
    let flat = false;
    //renderer.setElementAttribute(el.nativeElement, 'draggable', 'true');
    renderer.listen(el.nativeElement, 'touchstart', e => {
      e.preventDefault();
      flat = true;
      this.dragItStart.emit(e);
    })
    renderer.listen(el.nativeElement, 'touchmove', (e) => {
      e.preventDefault();
      if(!this.canEmit) return;
      setTimeout(() => {
        this.canEmit = true;
      }, 50);
      if(flat){
        let percent : number = 0;
        if(this.dragIt){
          percent = (e.targetTouches[0].clientX - e.path[2].offsetLeft) / e.path[2].clientWidth;
        }else{
          percent = e.targetTouches[0].clientX / e.path[2].clientWidth;
        }
        if(percent <= 1 && percent >= 0){
          this.canEmit = false;
          this.dragItMove.emit(percent);
        }
      }
    });
    renderer.listen(el.nativeElement, 'touchend', (e) => {
      flat = false;
      this.dragItEnd.emit(this.dragIt)
    });
  }
}
