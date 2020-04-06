import React from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { fireEvent, render, act, wait } from '@testing-library/react';
import { Form } from '..';

interface IForm {
  firstName: string;
}

const validate = (values: IForm) => {
  const errors: Partial<IForm> = {};

  if (!values.firstName) {
    errors.firstName = 'This field is required';
  }

  return errors;
};

const onSubmit = jest.fn();
const buttonLabel = 'continue';
const fieldLabel = 'First name';

const renderComponent = (props = {}) =>
  render(
    <Formik validateOnMount initialValues={{ firstName: '' }} validate={validate} onSubmit={onSubmit}>
      <FormikForm>
        <Form.TextField label={fieldLabel} name="firstName" />
        <Form.Button {...props}>{buttonLabel}</Form.Button>
      </FormikForm>
    </Formik>,
  );

describe('<Form.Button />', () => {
  afterEach(() => {
    onSubmit.mockReset();
  });

  it('renders disabled button', async () => {
    const { getByText } = renderComponent();
    await wait();
    expect(getByText(buttonLabel)).toBeDisabled();
  });

  it('renders enabled button', async () => {
    const { getByText, getByLabelText } = renderComponent();
    await act(async () => {
      await fireEvent.change(getByLabelText(fieldLabel), { target: { value: 'name' } });
    });
    expect(getByText(buttonLabel)).not.toBeDisabled();
  });

  it('renders disabled button even though the form is valid', async () => {
    const { getByText, getByLabelText } = renderComponent({ disabled: true });
    await act(async () => {
      await fireEvent.change(getByLabelText(fieldLabel), { target: { value: 'name' } });
    });
    expect(getByText(buttonLabel)).toBeDisabled();
  });

  it('calls onSubmit callback', async () => {
    const { getByText, getByLabelText } = renderComponent();
    const value = 'name';
    await act(async () => {
      await fireEvent.change(getByLabelText(fieldLabel), { target: { value } });
    });
    await act(async () => {
      await fireEvent.click(getByText(buttonLabel));
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ firstName: value });
  });
});
