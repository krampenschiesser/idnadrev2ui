import * as React from 'react';
import { observer } from 'mobx-react';
import LocalCryptoStorage from '../../store/LocalCryptoStorage';

import { Form, Icon, Input, Button } from 'antd';
import { FormComponentProps, FormItemProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import Layout from 'antd/lib/layout/layout';

import './BrowserLogin.css';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';

const {Header, Content} = Layout;

export interface BrowserLoginProps extends FormComponentProps {
  cryptoStorage: LocalCryptoStorage;
}

@observer
export default class BrowserLoginForm extends React.Component<BrowserLoginProps, object> {
  handleLogin = () => {
    let password = this.props.form.getFieldValue('password');
    this.props.cryptoStorage.open(password);
  };

  handleCreate = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let password = this.props.form.getFieldValue('password1');
        this.props.cryptoStorage.create(password);
        if (window) {
          window.location.href = '/';
        }
      }
    });
  };

  // tslint:disable-next-line
  checkPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password1')) {
      callback('Both passwords need to match!');
    } else {
      callback();
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    let create = !this.props.cryptoStorage.exists();
    const title = create ? 'Please choose a password' : 'Please login';
    const itemProps: FormItemProps = {
      labelCol: {span: 4},
      wrapperCol: {span: 6}

    };

    let formItems = create ? (
      <Form onSubmit={this.handleCreate} className='login-form'>
        <FormItem {...itemProps} label='Password' colon={true}>
          {getFieldDecorator('password1', {
            rules: [{required: true, message: 'Please input your Password!'}],
          })(
            <Input prefix={<Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}}/>}
                   type='password'
                   placeholder='Password'/>
          )}
        </FormItem>
        <FormItem {...itemProps} label='Repeat' colon={true}>
          {getFieldDecorator('password2', {
            rules: [{
              required: true,
              message: 'Please repeat your password.'
            }, {validator: this.checkPassword}],
          })(
            <Input prefix={<Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}}/>}
                   type='password'
                   placeholder='Password'/>
          )}
        </FormItem>
        <FormItem wrapperCol={{offset: 4}}>
          <Button type='primary' onClick={this.handleCreate} className='login-form-button'>
            Create password
          </Button>
        </FormItem>
      </Form>
    ) : (
      <Form onSubmit={this.handleLogin} className='login-form'>
        <FormItem {...itemProps}>
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please input your Password!'}],
          })(
            <Input prefix={<Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}}/>}
                   type='password'
                   placeholder='Password'/>
          )}
        </FormItem>
        <FormItem wrapperCol={{offset: 4}}>
          <Button type='primary' onClick={this.handleLogin} className='login-form-button'>
            Log in
          </Button>
        </FormItem>
      </Form>
    );
    return (
      <div>
        <Layout>
          <Header style={{backgroundColor: 'white'}}>
            <Row type='flex' justify='center'>
              <Col xs={10}>
                <h1>{title}</h1>
              </Col>
            </Row>
          </Header>
          <Content>
            <Row type='flex' justify='center'>
              <Col xs={10}>
                {formItems}
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}

export const BrowserLogin = Form.create()(BrowserLoginForm);
