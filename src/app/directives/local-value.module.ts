import { NgModule } from "@angular/core";
import { LocalValueDirective } from "./local-value.directive";
@NgModule({
  declarations: [LocalValueDirective],
  exports: [LocalValueDirective]
})
export class LocalValueDirectiveModule {}
