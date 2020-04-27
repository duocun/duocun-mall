import { Directive, Input, ElementRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Directive({
  selector: "[localValue]"
})
export class LocalValueDirective {
  @Input() data: object;
  @Input() key: string;
  @Input() fallback: string;

  constructor(private translator: TranslateService, private el: ElementRef) {}

  ngOnChanges() {
    this.translator.onLangChange.subscribe((event) => {
      const text = this.getValueFromData(this.data, this.key, event.lang);
      this.setText(text);
    });
    const text = this.getValueFromData(
      this.data,
      this.key,
      this.translator.currentLang
    );
    this.setText(text);
  }

  getValueFromData(data, key, lang) {
    let value = "";
    try {
      switch (lang) {
        case "zh": {
          value = this.data[this.key];
          break;
        }
        case "en": {
          if (this.data[this.key + "EN"]) {
            value = this.data[this.key + "EN"];
            break;
          }
        }
        default:
          value = this.data[this.key];
          break;
      }
    } catch (e) {
      if (this.fallback) {
        this.translator.get(this.fallback).subscribe((v) => {
          value = v;
        });
      }
    }
    if (!value) {
      value = this.fallback || "";
    }
    return value;
  }

  setText(text) {
    this.el.nativeElement.innerText = text;
  }
}
