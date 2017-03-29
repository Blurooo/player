import {Directive, ElementRef, Renderer} from "@angular/core";
import {NavController} from "ionic-angular";
/**
 * Created by zo on 2017/3/29.
 */
@Directive({
  selector : '[goBack]'
})
export class BackDirective{
  constructor(renderer : Renderer, el : ElementRef, navCtl : NavController){
    renderer.listen(el.nativeElement, 'click', () => {
      console.log('go back');
      navCtl.pop();
    })
  }
}
