import { Tag } from '../dto/Tag';

export interface ThoughtFilter {
  name?: string;
  content?: string;
  tags?: Tag[];
  postponed?: boolean;
}