import IdnadrevFileFilter from '../filter/IdnadrevFileFilter';

export interface ThoughtFilter extends IdnadrevFileFilter{
  postponed?: boolean;
}