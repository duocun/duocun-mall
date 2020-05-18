export enum PageStatus {
  DRAFT = "draft",
  PUBLISH = "publish"
}

export interface PageTabInterface {
  _id?: string;
  title: string;
  titleEN?: string;
  slug: string;
}
export interface PageInterface extends PageTabInterface {
  description: string;
  descriptionEN?: string;
  keywords?: string;
  content: string;
  contentEN?: string;
  status: PageStatus;
  created: string;
  modified: string;
}
