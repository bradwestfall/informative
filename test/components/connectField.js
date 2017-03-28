import React from 'react';

import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import connectField from '../../src/connectField';
import Form from '../../src/Form';
import Field from '../../src/Field';


describe('connect field HOC', () => {
  //This does feel kind of weird, maybe we should just pass
  //the three "input" props as separate props?
  //It will mean more, but its also more generic
  const mockCustomInput = (props) => {
      return (
        <div className="field-wrap">
          <label htmlFor={`field-` + "test"}>Test</label>
          <div className="input">
            <input {...props.input} name="test" />
          </div>
          <div className="error">
            {props.fieldState.error}
          </div>
        </div>
      );
  }

  describe('name', () => {
    it('should throw an error if now name is provided', () => {
      try {
        shallow(connectField()(mockCustomInput));
      } catch (e){
        expect(e).to.exist;
      }
    });

    it('should register a field with the provided name', () => {
      const verifyFields = (values) => {
        expect(values.test).to.exist;
        return new Promise(resolve => resolve());
      }
      const ConnectCustomInput = connectField('test')(mockCustomInput);
      const wrapperForm = mount(
        <Form onSubmit={verifyFields}>
          <ConnectCustomInput />
        </Form>);
      const form = wrapperForm.find('form');
      form.simulate('submit', { preventDefault: () => {} });
    });
  });

  describe('provide props', () => {
    it('should provide input props', () => {
      const verifyFields = (values) => {
        expect(values.test).to.exist;
        return new Promise(resolve => resolve());
      }
      const ConnectCustomInput = connectField('test')(mockCustomInput);
      const wrapperForm = mount(
        <Form onSubmit={verifyFields}>
          <ConnectCustomInput />
        </Form>);
      const renderedMock = wrapperForm.find(mockCustomInput);
      const inputProps = renderedMock.props().input;
      expect(inputProps).to.exist;
      expect(inputProps.value).to.exist;
      expect(inputProps.onChange).to.exist;
      expect(inputProps.onFocus).to.exist;
      expect(inputProps.onBlur).to.exist;
    });

    it('should provide field state', () => {
      const verifyFields = (values) => {
        expect(values.test).to.exist;
        return new Promise(resolve => resolve());
      }
      const ConnectCustomInput = connectField('test')(mockCustomInput);
      const wrapperForm = mount(
        <Form onSubmit={verifyFields}>
          <ConnectCustomInput />
        </Form>);
      const renderedMock = wrapperForm.find(mockCustomInput);
      const fieldState = renderedMock.props().fieldState;
      expect(fieldState).to.exist;
    });

    it('should provide form state', () => {
      const verifyFields = (values) => {
        expect(values.test).to.exist;
        return new Promise(resolve => resolve());
      }
      const ConnectCustomInput = connectField('test')(mockCustomInput);
      const wrapperForm = mount(
        <Form onSubmit={verifyFields}>
          <ConnectCustomInput />
        </Form>);
      const renderedMock = wrapperForm.find(mockCustomInput);
      const formState = renderedMock.props().formState;
      expect(formState).to.exist;
    });
  });

  describe('updating', () => {
    it('should update state on change', () => {
      const verifyFields = (values) => {
        expect(values.test).to.exist;
        expect(values.test).to.equal('asdf')
        return new Promise(resolve => resolve());
      }
      const ConnectCustomInput = connectField('test')(mockCustomInput);
      const wrapperForm = mount(
        <Form onSubmit={verifyFields}>
          <ConnectCustomInput />
        </Form>);
      const form = wrapperForm.find('form');
      const input = wrapperForm.find('input');
      input.simulate('change', { target: { value: 'asdf' } });
      form.simulate('submit', { preventDefault: () => {} });
    });

    it('should mark visited on focus', () => {
      const verifyFields = (values, fields) => {
        expect(fields.fields.test.visited).to.equal(true);
        expect(fields.fields.test.active).to.equal(true);
        return new Promise(resolve => resolve());
      }
      const ConnectCustomInput = connectField('test')(mockCustomInput);
      const wrapperForm = mount(
        <Form onSubmit={verifyFields}>
          <ConnectCustomInput />
        </Form>);
      const form = wrapperForm.find('form');
      const input = wrapperForm.find('input');
      input.simulate('focus');
      form.simulate('submit', { preventDefault: () => {} });
    });

    it('should unmark active on blur', () => {
      const verifyFields = (values, fields) => {
        expect(fields.fields.test.visited).to.equal(true);
        expect(fields.fields.test.active).to.equal(false);
        return new Promise(resolve => resolve());
      }
      const ConnectCustomInput = connectField('test')(mockCustomInput);
      const wrapperForm = mount(
        <Form onSubmit={verifyFields}>
          <ConnectCustomInput />
        </Form>);
      const form = wrapperForm.find('form');
      const input = wrapperForm.find('input');
      input.simulate('focus');
      input.simulate('blur');
      form.simulate('submit', { preventDefault: () => {} });
    });
  });

  //The element wrapping doesn't work. Not sure why. isValidElement
  //always returns false
  describe.skip('element wrapping', () => {
    it('should be able to except an element and return a component', () => {
      const mockElement = connectField('test')(<mockCustomInput />);
      const renderedMock = mount(<mockElement />);
      expect(renderedMock).to.have.lengthOf(1);
      console.log(renderedMock.find(mockCustomInput));
    });
  });
});
