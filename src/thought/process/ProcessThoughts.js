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
import {observer, inject} from "mobx-react";
import {Markdown, Article, Section, Box, Button, Header, Title} from "grommet"
import SiteTitle from "./../../navigation/SiteTitle"
import TagContainer from "./../../tag/TagContainer.js"
import Swipeable from "react-swipeable";

import NextIcon from 'grommet/components/icons/base/Next';
import PreviousIcon from 'grommet/components/icons/base/Previous';

import {processThoughtState, currentProcessThought, isMobile} from "./../../store/UiMappers.js";

@inject("store", "uistore")
@observer
export default class ProcessThoughts extends Component {
    componentDidMount() {
        const state = processThoughtState(this);
        let thought = state.current;
        if (!thought) {
            const thoughts = this.props.store.thoughts;
            if (thoughts && thoughts.length > 0) {
                state.setCurrentThought(thoughts[0]);
            }
        }
    }

    next = () => {
        const state = processThoughtState(this);
        let thought = state.current;
        const thoughts = this.props.store.thoughts;

        if (thoughts && thoughts.length > 0) {
            const index = thoughts.indexOf(thought);
            let nextPos = index + 1;
            if (nextPos >= thoughts.length) {
                nextPos = 0;
            }
            state.setCurrentThought(thoughts[nextPos]);
        } else {
            state.setCurrentThought(null);
        }
    };

    prev = () => {
        const state = processThoughtState(this);
        let thought = state.current;
        const thoughts = this.props.store.thoughts;

        if (thoughts && thoughts.length > 0) {
            const index = thoughts.indexOf(thought);
            let nextPos = index - 1;
            if (nextPos < 0) {
                nextPos = thoughts.length - 1;
            }
            state.setCurrentThought(thoughts[nextPos]);
        } else {
            state.setCurrentThought(null);
        }
    };

    onKeyPress = (event) => {
        console.log(event);
        console.log(event.key);
        console.log(event.charCode);
        console.log(event.keyCode);
        if (event.key === "ArrowLeft") {
            this.prev();
        } else if (event.key === "ArrowRight") {
            this.next();
        }
    };

    onSwipeLeft = (event) => {
        console.log("Swipe left");
        console.log(event);
        this.prev();
    };
    onSwipeRight = (event) => {
        console.log("Swipe right");
        console.log(event);
        this.next();
    };

    render() {
        const thought = currentProcessThought(this);
        if (!thought) {
            return <h3>No thought available</h3>
        }
        const mobile = isMobile(this);
        return (
            <div ref={(el) => el && !mobile && el.focus() } onKeyDown={this.onKeyPress} autoFocus tabIndex="0">
                <Article >
                    <SiteTitle title="Process thoughts"/>
                    <Section>
                        <Box responsive={false} direction="row" full="horizontal" justify="center"
                             alignContent="center" alignSelf="center">
                            {!mobile && (
                                <Box alignContent="center">
                                    <Button plain={true} icon={<PreviousIcon />} onClick={this.prev}/>
                                </Box>
                            )}
                            <Box responsive={false} full="horizontal" direction="row" justify="center">
                                <Swipeable onSwipedLeft={this.onSwipeLeft} onSwipedRight={this.onSwipeRight}>
                                    <Box justify="start">
                                        <Header>
                                            <Title>{thought.name}</Title>
                                        </Header>
                                        <Markdown content={thought.content}/>
                                        <TagContainer margin="small" showLabel={true} tags={thought.tags}/>
                                    </Box>
                                </Swipeable>
                            </Box>
                            {!mobile && (
                                <Box alignContent="center">
                                    <Button plain={true} icon={<NextIcon/>} onClick={this.next}/>
                                </Box>
                            )}
                        </Box>
                    </Section>
                </Article>
            </div>
        );
    }
}