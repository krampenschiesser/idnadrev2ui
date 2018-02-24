import * as React from 'react';

export function dateCell(date: Date, record: {}, index: number): React.ReactNode {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}