import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "price",
  pure: false
})
export class PricePipe implements PipeTransform {
  formatter: any;

  constructor() {
    this.formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    });
  }

  transform(value: any): string {
    if (typeof value === "object") {
      return this.transform(value.price);
    }
    value = parseFloat(`${value}`);
    if (isNaN(value)) {
      value = 0;
    }
    return this.formatter.format(value);
  }
}
