import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
  name: "moment",
  pure: false
})
export class MomentPipe implements PipeTransform {
  constructor(private lang: TranslateService) {}
  transform(value: any, ...args: Array<any>): any {
    const date = moment(value);
    date.locale(this.lang.currentLang === "zh" ? "zh-cn" : "en");
    const [format] = args;
    return date.format(format);
  }
}
