import Thought from '../../dto/Thought';
import * as React from 'react';


function logRowEnter() {
    console.log("enter row")
}

function onRef(span: any ) {
    let tr = span.parentNode.parentNode;
    tr.onmouseenter = logRowEnter;
    console.log(tr)
}
export function dateCell(date: Date, record: Thought, index: number): React.ReactNode {
    return <span ref={onRef} style={{backgroundColor: 'red'}}>{date.toLocaleDateString() + ' '+ date.toLocaleTimeString()}</span>;
}