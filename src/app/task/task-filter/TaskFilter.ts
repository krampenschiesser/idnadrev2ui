import IdnadrevFileFilter from '../../filter/IdnadrevFileFilter';

export default interface TaskFilter extends IdnadrevFileFilter{
  finished?: boolean;
  state?: string;
  remainingTime?: number;
  actionable?: boolean;
  project?: boolean;
  earliestStartDate?: Date;
}