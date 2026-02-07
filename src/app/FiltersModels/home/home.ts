import { Source } from "../../Shared/interfaces/Home/home.interface";

export class Home   {
 declare source: Source;
 declare author: string | null;
  declare title: string;
  declare description: string;
  declare url: string;
  declare urlToImage: string | null;
  declare publishedAt: string;
  declare content: string;
}