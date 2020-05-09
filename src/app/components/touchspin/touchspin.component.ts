import { Component, OnInit, Input, Output, ViewChild } from "@angular/core";
import { EventEmitter } from "@angular/core";


@Component({
  selector: "ion-touchspin",
  templateUrl: "./touchspin.component.html",
  styleUrls: ["./touchspin.component.scss"]
})
export class TouchspinComponent implements OnInit {
  
  @Input() size: "sm" | "md" | "lg";
  @Input() initialValue: number;
  @Input() value: number;
  @Input() minimumValue: number;
  @Input() maximumValue: number | null;
  @Input() isValid: (value: number) => boolean;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  minValue: number;
  maxValue: number;

  constructor() {}

  @ViewChild("valueInput", { static: true }) valueInput;
  ngOnInit() {
    this.size = this.size || "md";
    this.initialValue = this.initialValue || 0;
    this.value = this.value || this.initialValue;
    this.minValue = this.minimumValue === undefined ? 1 : this.minimumValue;
    this.maxValue = this.maximumValue;
  }

  setValue(newValue: number, action: "up" | "down" | "set") {
    this.valueChange.emit({
      value: newValue,
      newValue,
      oldValue: this.value,
      action,
      ref: this
    });
    this.value = newValue;
  }

  handleUp() {
    const newValue = this.value + 1;
    if (this.isInRange(newValue) && this.checkValidity(newValue)) {
      this.setValue(newValue, "up");
    }
  }

  handleDown() {
    const newValue = this.value - 1;
    if (this.isInRange(newValue) && this.checkValidity(newValue)) {
      this.setValue(newValue, "down");
    }
  }

  handleChange(val) {
    const newValue = parseInt(val);
    if (this.isInRange(val) && this.checkValidity(newValue)) {
      this.setValue(newValue, "set");
    }
  }

  isInRange(val) {
    if (this.minValue !== null) {
      if (val < this.minValue) {
        return false;
      }
    }
    if (this.maxValue !== null) {
      if (val > this.maxValue) {
        return false;
      }
    }
    return true;
  }

  checkValidity(value: number) {
    if (!this.isValid) {
      return true;
    }
    return this.isValid(value);
  }
}
