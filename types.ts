export interface QueryResult {
  id: number;
  match: boolean;
  text: string;
  real: boolean;
  highlight?: string;
}

export interface TextData {
  title: string;
  description: string;
  items: Item[];
}

export interface Item {
  text: string;
  real: number;
}
