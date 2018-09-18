import * as React from 'react';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import UiStore from '../../store/UiStore';
import './Repository.css';
import { RouteComponentProps } from 'react-router';
import { RepositoryId } from '../../dto/RepositoryId';
import { Button, Form, Icon, Input, message, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Repository from '../../dto/Repository';
import { observable } from 'mobx';

const FormItem = Form.Item;

interface MatchParams {
  repoId: RepositoryId;
}

export interface RepositoryLoginProps extends RouteComponentProps<MatchParams> {
  uiStore: UiStore;
  store: GlobalStore
}

interface RepoLoginProps extends FormComponentProps {
  repo: Repository;
  onSubmit: (pw: string) => void;
}


class RepoLogin extends React.Component<RepoLoginProps, {}> {

  hasErrors = (fieldsError: Object) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  onSubmit = () => {
    let password: string | undefined = this.props.form.getFieldValue('password');
    if (password && password.length > 0) {
      this.props.onSubmit(password);
    }
  };

  render() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="inline" onSubmit={this.onSubmit}>
        <FormItem
          validateStatus={passwordError ? 'error' : 'success'}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please provide a Password!'}],
          })(
            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" placeholder="Password"/>
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
          >
            Log into repository
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const RepoLoginForm = Form.create()(RepoLogin);

@inject('store', 'uiStore')
@observer
export default class RepositoryLogin extends React.Component<RepositoryLoginProps, object> {
  @observable
  error: string | undefined;
  @observable
  progress: boolean = false;

  handleSubmit = async (repo: Repository, pw: string) => {
    this.progress = true;

    repo.open(pw).then(() =>{
      console.log('done')
      this.progress = false;
    }).catch(r=>{
      console.log(r);
      this.error = 'Could not login';
      this.progress = false;
    });
  };

  render() {
    let repoId = this.props.match.params.repoId;
    let repository = this.props.store.getRepository(repoId);

    if (repository) {
      let content = (
        <div>
          {this.error && message.error(this.error)}
          <p>Log into repository <b>{repository.name}</b></p>
          <RepoLoginForm
            repo={repository} onSubmit={(pw) => {
            if (repository) {
              this.handleSubmit(repository, pw);
            }
          }}/>
        </div>

      );
      if (this.progress) {
        return <Spin>{content}</Spin>;
      } else {
        return content;
      }
    } else {
      return <h1> Repository <b>{repoId}</b> not known</h1>;
    }
  }
}