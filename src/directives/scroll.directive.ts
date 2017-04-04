import {Directive, ElementRef, Input, Renderer} from "@angular/core";
import {NavController} from "ionic-angular";
/**
 * Created by zo on 2017/3/29.
 */
@Directive({
  selector : '[scroll]'
})
export class ScrollDirective{

  @Input()
  scroll : number;

  constructor(renderer : Renderer, el : ElementRef, navCtl : NavController){
    console.log('得到', this.scroll, el.nativeElement);
    el.nativeElement.scrollTop = 200;
  }
}
