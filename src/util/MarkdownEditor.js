/*
 * Copyright 2017 Christian Löhnert. See the COPYRIGHT
 * file at the top-level directory of this distribution.
 *
 * Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
 * http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
 * <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
 * option. This file may not be copied, modified, or distributed
 * except according to those terms.
 */

import React, {Component} from "react"
import CodeMirror from "react-codemirror"
import 'codemirror/mode/markdown/markdown';
import {Anchor, Box} from "grommet";
import {observer, inject} from 'mobx-react';
import {observable, action} from 'mobx';
import {isMobile} from "../store/UiMappers.js"

const style = {
    color: '#333333',
    fontWeight: 'bold',
};

const lineStyle = {
    paddingLeft: '30px',
};

class MarkdownButton extends Component {
    render() {
        const char = this.props.char;
        const onClick = this.props.onClick;

        return (
            <Box focusable={false} pad={{horizontal: "medium", vertical: 'small'}} margin={{horizontal: "small"}}
                 onClick={onClick}>
                <Anchor style={style} label={char} onClick={onClick}/>
            </Box>
        );
    }
}

const styleTop = {
    position: 'fixed',
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '0px 0px 2px 2px',
    borderStyle: 'solid',
    borderWidth: '0px 1px 1px',
    borderColor: 'rgba(0, 0, 0, 0.0980392)',
    zIndex: 65000,
    fontFamily: 'Helvetica, sans-serif',
    display: 'flex',
    padding: '0px 5px',
    top: 0,
    left: 0,
    right: 0,
    align: 'center',
}

@inject("uistore")
@observer
export default class MarkdownEditor extends Component {
    componentDidMount() {
        window.addEventListener('scroll', this.adjustMobileMenu);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.adjustMobileMenu);
    }

    @observable focus = false;
    @observable showMobilMenuOnTop = false;

    insert = (char, e) => {
        e.preventDefault();
        e.stopPropagation();
        const cm = this.codeMirror.getCodeMirror();

        cm.replaceSelection(char);
        const {line, ch} = cm.getCursor();
        cm.focus();
        cm.setCursor(line, ch);
    };

    @action
    changeFocus = (focused) => {
        this.adjustMobileMenu()

        this.lastFocusEvent = focused;
        if (this.focus && !focused) {
            setTimeout(() => {
                this.focus = this.lastFocusEvent;
            }, 300);
        } else {
            this.focus = focused;
        }
    }

    @action
    adjustMobileMenu = () => {
        const cm = this.codeMirror.getCodeMirror();
        const inputField = cm.getInputField();
        const yPosition = inputField.getBoundingClientRect().top
        if (yPosition < 90) {
            this.showMobilMenuOnTop = true;
        } else {
            this.showMobilMenuOnTop = false;
        }
    }

    onChange = (text) => {
        this.adjustMobileMenu();
        this.props.onChange && this.props.onChange(text);
    }

    render() {
        const options = {
            lineNumbers: true,
            mode: "markdown",
            extraKeys: {
                'Ctrl-Enter': () => {
                    this.props.onSubmit && this.props.onSubmit();
                },
                'Cmd-Enter': () => {
                    this.props.onSubmit && this.props.onSubmit();
                },
            }
        }

        const buttons = ["#", "*", "-", ">", "```\n"];


        const showOnTop = this.focus && this.showMobilMenuOnTop;
        const showInline = isMobile(this) && this.focus && !this.showMobilMenuOnTop;
        let mobileMenu = (
            <Box direction="row" responsive={false} justify="start">
                {showInline && <Box style={lineStyle}/>}
                {buttons.map(char => <MarkdownButton key={char} onClick={(e) => this.insert(char, e)}
                                                     char={char}/>)}
            </Box>
        );
        let wrappedForTop = (
            <div style={styleTop}>
                {mobileMenu}
            </div>
        );

        return (
            <Box style={this.props.style} pad={isMobile(this) ? null : {vertical: 'small'}} direction="column">
                {showOnTop && wrappedForTop}
                {showInline && mobileMenu}
                <CodeMirror ref={(cm) => this.codeMirror = cm} onChange={this.onChange} options={options}
                            onFocusChange={this.changeFocus} onScroll={this.adjustMobileMenu} value={this.props.value}
                />
            </Box>
        );
    }
}