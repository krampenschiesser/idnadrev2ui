import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {GlobalStore} from '../../store/GlobalStore';
import {observable} from 'mobx';
import Thought from '../../dto/Thought';
import UiStore from '../../store/UiStore';
import ThoughtPreview from './ThoughtPreview';
import {Layout} from 'antd';

const {Footer, Sider, Content} = Layout;

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
    }

    showMarkdownPreview = (thought: Thought) => {
        this.previewThought = thought;
    };
    toTask = () => {

    };
    toDocument = () => {

    };
    delete = () => {

    };
    postpone = () => {

    };

    render() {
        let thoughts = this.thoughts;
        if (thoughts === undefined) {
            thoughts = [];
        }

        return (
            <Layout>
                <Content>
                    <Layout>
                        <Sider style={{background: '#fff'}}>
                            blubb
                        </Sider>
                        <Content>
                            <ThoughtPreview thought={this.previewThought} store={this.props.store}/>
                        </Content>
                        <Sider style={{background: '#fff'}}>
                            bla
                        </Sider>
                    </Layout>
                </Content>
                <Footer>
                    foot
                </Footer>
            </Layout>
        );
    }
}
