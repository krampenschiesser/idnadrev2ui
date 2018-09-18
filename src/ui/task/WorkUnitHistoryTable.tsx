import * as React from 'react';
import { observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import Task from '../../dto/Task';
import { dateCell } from '../table/DateCell';
import Table from 'antd/lib/table/Table';
import Column from 'antd/lib/table/Column';

interface DisplayWorkUnit {
  start: Date;
  end?: Date;
  duration?: number;
  id: string;
  type: string;
}

class WorkUnitTable extends Table<DisplayWorkUnit> {
}

class WorkUnitColumn extends Column<DisplayWorkUnit> {
}

export interface WorkUnitHistoryTableProps {
  task?: Task;
  store: GlobalStore;
  // showActions?: boolean;
}

@observer
export default class WorkUnitHistoryTable extends React.Component<WorkUnitHistoryTableProps, object> {
  render() {
    let workUnits = this.props.task ? this.props.task.details.workUnits : [];
    let data: DisplayWorkUnit[] = workUnits.map(w => {
      let durationInMinutes = w.getDurationInMinutes();
      let type = 'WorkUnit';
      let id = type + w.start.toString();
      return {
        id: id,
        type: type,
        duration: durationInMinutes,
        start: w.start,
        end: w.end
      };
    });
    data.sort((a, b) => a.start.getTime() - b.start.getTime());

    return (
      <WorkUnitTable rowKey='id' dataSource={data}>
        <WorkUnitColumn dataIndex='type' title='Type'/>
        <WorkUnitColumn dataIndex='start' title='Start' render={dateCell}/>
        <WorkUnitColumn dataIndex='end' title='End' render={dateCell}/>
        <WorkUnitColumn dataIndex='duration' title='Duration'/>
      </WorkUnitTable>
    );
  }
}
