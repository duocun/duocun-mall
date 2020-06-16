import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { CategoryListComponent } from "./category-list.component";
import { RouterModule } from "@angular/router";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([]),
    LocalValueDirectiveModule,
  ],
  declarations: [CategoryListComponent],
  exports: [CategoryListComponent]
})
export class CategoryListModule {}
