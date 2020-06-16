/* eslint-disable prettier/prettier */
import { Component, OnInit, Input } from "@angular/core";
import { environment } from "src/environments/environment";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "moneris-ht",
  templateUrl: "./moneris-ht.component.html",
  styleUrls: ["./moneris-ht.component.scss"]
})
export class MonerisHtComponent implements OnInit {
  profileId: string;
  cssBody: string;
  cssTextBox: string;
  cssTextBoxPan: string;
  cssTextBoxExp: string;
  cssTextBoxCvd: string;
  cssInputLabel: string;
  iframeSrc: any;

  constructor(private sanitizer: DomSanitizer) {
    this.profileId = environment.monerisHTProfileId;

    const bodyWidth = window.innerWidth > 1170 ?  720 : (window.innerWidth > 768 ? 540 : window.innerWidth > 576 ? 480 : 320 )

    this.cssBody = 
      `background: white;` +
      `width: ${bodyWidth};` +
      `margin-left: auto;` +
      `margin-right: auto;`
    ;

    this.cssTextBox = 
      `border-width: 2px;` +
      `width: ${bodyWidth - 40}px;` +
      `font-size: .875rem;` +
      `padding: 5px 2px;` +
      `margin: 4px auto;`
    ;

    this.cssTextBoxExp = this.cssTextBoxCvd = 
      `width: ${(bodyWidth - 50) / 2};` +
      `display: inline-block;` +
      `margin-left: 5px;`
    ;

    this.cssTextBoxExp = this.cssTextBoxExp + 
      `margin-left: 20px;` +
      `margin-right: 5px;`
    ;

    this.cssInputLabel =
      `margin: 12px auto 6px;` +
      `display: block;`
    ;

    const panLabel = "Card Number";
    const expLabel = "Expiry Date (MMYY)";
    const cvdLabel = "CVD";

    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(
        `https://esqa.moneris.com/HPPtoken/index.php?id=${this.profileId}` +
        `&css_body=${this.cssBody}` +
        `&css_textbox=${this.cssTextBox}` +
        `&css_textbox_exp=${this.cssTextBoxExp}` +
        `&css_textbox_cvd=${this.cssTextBoxCvd}` +
        `&css_input_label=${this.cssInputLabel}` +
        `&pmmsg=true` +
        `&display_labels=2` +
        `&enable_exp=1` +
        `&enable_cvd=1` +
        `&pan_label=${panLabel}` +
        `&exp_label=${expLabel}` +
        `&cvd_label=${cvdLabel}`
      )
    );
  }

  ngOnInit() {}
}
