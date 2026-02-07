
export interface Home {
  status: string;
  totalResults: number;
  articles: Article[];
}


export interface Source {
  id: string | null;
  name: string;
}



export interface Article {
  source: Source;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string; // ISO date string
  content: string;
}


