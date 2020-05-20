import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
  selector: "app-ion-image",
  templateUrl: "./ion-image.component.html",
  styleUrls: ["./ion-image.component.scss"]
})
export class IonImageComponent implements OnInit {
  @Input("src") src: string;
  @Input("alt") alt: string;
  @Input("style") style: string;
  @Input("placeholder") placeholderSrc: string;
  loading: boolean;
  error: boolean;
  safeStyle: SafeStyle;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loading = true;
    this.placeholderSrc = this.placeholderSrc || "assets/img/no-image.png";
    this.error = false;
    this.safeStyle = this.sanitizer.bypassSecurityTrustStyle(
      <string>this.style
    );
  }

  ionImgDidLoad() {
    this.loading = false;
  }

  ionError() {
    this.error = true;
  }
}
