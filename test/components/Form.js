import React from 'React';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import Form from '../../src/Form';
import Field from '../../src/Field';

describe('Form', () => {
  describe('initial values', () => {
    it('should set initial values on descendant fields', () => {
      const exampleForm =
        <Form initialValues={{ bobo: 'abcdef'}}>
          <Field type="text" component="input" name="bobo" className="descendant" />
        </Form>;
      const renderedForm = mount(exampleForm);
      const renderedInput = renderedForm.find('input');
      expect(renderedInput).to.have.lengthOf(1);
      expect(renderedInput.props().value).to.equal('abcdef');
    });
  });
});
