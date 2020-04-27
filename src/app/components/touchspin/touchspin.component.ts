import { Component, OnInit, Input, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "ion-touchspin",
  templateUrl: "./touchspin.component.html",
  styleUrls: ["./touchspin.component.scss"]
})
export class TouchspinComponent implements OnInit {
  @Input() size: "sm" | "md" | "lg";
  @Input() initialValue: number;
  @Input() minimumValue: number;
  @Input() maximumValue: number | null;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  value: number;
  minValue: number;
  maxValue: number;

  constructor() {}

  ngOnInit() {
    this.size = this.size || "md";
    this.initialValue = this.initialValue || 0;
    this.value = this.initialValue;
    this.minValue = this.minimumValue === undefined ? 1 : this.minimumValue;
    this.maxValue = this.maximumValue;
  }

  handleUp() {
    const newValue = this.value + 1;
    if (this.isInRange(newValue)) {
      this.valueChange.emit({
        value: newValue,
        newValue,
        oldValue: this.value,
        action: "up"
      });
      this.value = newValue;
    }
  }

  handleDown() {
    const newValue = this.value - 1;
    if (this.isInRange(newValue)) {
      this.valueChange.emit({
        value: newValue,
        newValue,
        oldValue: this.value,
        action: "down"
      });
      this.value = newValue;
    }
  }

  handleChange(val) {
    const newValue = parseInt(val);
    if (this.isInRange(val)) {
      this.valueChange.emit({
        value: newValue,
        newValue,
        oldValue: this.value,
        action: "set"
      });
      this.value = newValue;
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
}
