import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"]
})
export class CategoryListComponent implements OnInit {
  @Input() categories;
  @Input() selectedId;
  @Input() loading;
  @Output() onShowAll = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  lang;
  categoryDisplayLimit = 20;
  constructor(private translator: TranslateService) {
    this.lang = this.translator.currentLang || "en";
  }

  ngOnInit() {}

  showAll() {
    this.onShowAll.emit();
  }

  handleSelectCategory(cat) {
    this.onSelect.emit(cat);
  }
}
