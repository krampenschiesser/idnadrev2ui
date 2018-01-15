import Thought from '../../dto/Thought';
import * as React from 'react';

export function dateCell(date: Date, record: Thought, index: number): React.ReactNode {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}