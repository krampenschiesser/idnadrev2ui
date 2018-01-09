import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {GlobalStore} from '../../store/GlobalStore';
import {observable} from 'mobx';
import Thought from '../../dto/Thought';
import UiStore from '../../store/UiStore';
import ThoughtPreview from './ThoughtPreview';
import {Layout} from 'antd';
import Pagination from "antd/lib/pagination/Pagination";

const {Footer, Content} = Layout;

export interface ProcessThoughtsProps {
    store: GlobalStore
    uiStore: UiStore
}

@inject('store', 'uiStore')
@observer
export default class ProcessThoughts extends React.Component<ProcessThoughtsProps, object> {
    @observable thoughts: Thought[];
    @observable previewThought: Thought | null = null;

    componentWillMount() {
        this.props.uiStore.header = 'Process Thoughts';
    }

    componentDidMount() {
        this.props.store.getOpenThoughts().then((t: Thought[]) => {
            this.thoughts = t;
            if (this.thoughts && this.thoughts.length > 0) {
                this.previewThought = this.thoughts[0];
            }
        }).catch(e => {
            console.error('Could not load thoughts', e);
            console.error(e);
        });
        // window.onK
        window.addEventListener('onkeydown',this.onKeyPress)
    }

    componentWillUnmount() {
        window.removeEventListener('onkeydown',this.onKeyPress)
    }

    toTask = () => {

    };
    toDocument = () => {

    };
    delete = () => {

    };
    postpone = () => {

    };

    switchThought = (page: number) => {
        if (this.thoughts.length > page - 1) {
            this.previewThought = this.thoughts[page - 1];
        }
    };

    next = () => {
        if (this.getPageNumber() < this.thoughts.length ) {
            console.log("next page "+this.getPageNumber() + 1);
            this.switchThought(this.getPageNumber() + 1)
        }
    };

    previous = () => {
        if (this.getPageNumber() > 1) {
            this.switchThought(this.getPageNumber() - 1)
        }
    };

    onKeyPress = (e: KeyboardEvent) => {
        console.log(e)
        if (e.key === 'ArrowLeft') {
            this.previous();
            e.preventDefault()
        }
        if (e.key === 'ArrowRight') {
            this.next();
            e.preventDefault()
        }
    };


    render() {
        let thoughts = this.thoughts;
        if (thoughts === undefined) {
            thoughts = [];
        }
        let pageNumber = this.getPageNumber();

        return (
            <div>
                <Layout>
                    <Content>
                        <Layout>
                            <Content>
                                <ThoughtPreview thought={this.previewThought} store={this.props.store}/>
                            </Content>
                        </Layout>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        <Pagination current={pageNumber} pageSize={1}
                                    total={thoughts.length} onChange={this.switchThought}/>
                    </Footer>
                </Layout>
            </div>
        );
    }

    private getPageNumber(): number {
        let pageNumber = 0;
        if (this.previewThought != null) {
            pageNumber = this.thoughts.indexOf(this.previewThought);
        }
        pageNumber += 1;
        return pageNumber;
    }
}
