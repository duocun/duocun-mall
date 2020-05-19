import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Injectable({
  providedIn: "root"
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  setTitle(title: string) {
    this.title.setTitle(title);
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
    this.setTitle("多村 - Duocun");
    this.setDescription("多村送菜 - 免运费免小费 Toronto online shopping");
    this.setKeywords("村送菜，多村商城，多伦多网上购物");
  }
}
