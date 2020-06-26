import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Injectable({
  providedIn: "root"
})
export class SeoService {
  public DEFAULT_TITLE = "多村 - Duocun";
  public DEFAULT_DESCRIPTION =
    "多村送菜 - 免运费免小费 Toronto online shopping";
  public DEFAULT_KEYWORDS =
    "村送菜，多村商城，多伦多网上购物, 免运费, 免小费, Free shipping, No Fee, Canada grocery, Toronto, Online shopping";

  constructor(private title: Title, private meta: Meta) {}

  setTitle(title: string, addDefault = true) {
    if (addDefault) {
      this.title.setTitle(title + " | " + this.DEFAULT_TITLE);
    } else {
      this.title.setTitle(title);
    }
  }

  setDescription(desc: string) {
    this.meta.updateTag({ name: "description", content: desc });
  }

  setKeywords(keywords: string) {
    this.meta.updateTag({ name: "keywords", content: keywords });
  }

  setMetaTag(name: string, content: string) {
    this.meta.updateTag({ name, content });
  }

  setDefaultSeo() {
    this.setTitle(this.DEFAULT_TITLE);
    this.setDescription(this.DEFAULT_DESCRIPTION);
    this.setKeywords(this.DEFAULT_KEYWORDS);
  }
}
