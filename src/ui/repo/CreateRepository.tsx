import * as React from 'react';
import UiStore from '../../store/UiStore';
import GlobalStore from '../../store/GlobalStore';


class CreateRepositoryForm extends React.Component<{ store: GlobalStore, uiStore: UiStore }, {}> {
  render() {
    return (
      <p>create it</p>
    );
  }
}

const CreateRepository = CreateRepositoryForm;
export default CreateRepository;