import {Pipe, PipeTransform} from "@angular/core";
/**
 * Created by zo on 2017/4/2.
 */
@Pipe({
  name : 'showTime'
})
export class ShowTimePipe implements PipeTransform{

  transform(number : number, format : string) : string{
    if(format === 'ms'){
      number /= 1000;
    }
    if(!number) return '00:00';
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
}
