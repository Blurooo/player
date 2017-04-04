import {Pipe, PipeTransform} from "@angular/core";
/**
 * Created by zo on 2017/4/2.
 */
@Pipe({
  name : 'toTime'
})
export class ToTimePipe implements PipeTransform{

  transform(time : string) : number{
    let numberTime = time.trim().split(':');
    return +numberTime[0] * 60 * 1000 + +numberTime[1] * 1000;
  }
}
