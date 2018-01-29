import * as React from 'react';
import { observer } from 'mobx-react';
import { GlobalStore } from '../../store/GlobalStore';
import Task from '../../dto/Task';
import { dateCell } from '../table/DateCell';
import Table from 'antd/lib/table/Table';
import Column from 'antd/lib/table/Column';

export interface WorkUnitHistoryTableProps {
  task?: Task;
  store: GlobalStore;
  // showActions?: boolean;
}

@observer
export default class WorkUnitHistoryTable extends React.Component<WorkUnitHistoryTableProps, object> {
  render() {
    return (
      <Table expandedRowKeys={fileIds} rowKey='id' dataSource={data}>
        <Column dataIndex='type' title='Type'/>
        <Column dataIndex='start' title='Start' render={dateCell}/>
        <Column dataIndex='end' title='End' render={dateCell}/>
        <Column dataIndex='duration' title='Duration'/>
      </Table>
    );
  }
}
