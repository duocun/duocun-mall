import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment-timezone";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
@Pipe({
  name: "moment",
  pure: false
})
export class MomentPipe implements PipeTransform {
  constructor(private lang: TranslateService) {}
  transform(value: any, ...args: Array<any>): any {
    const date = moment(value).tz(environment.timezone);
    date.locale(this.lang.currentLang === "zh" ? "zh-cn" : "en");
    const [format] = args;
    return date.format(format);
  }
}
