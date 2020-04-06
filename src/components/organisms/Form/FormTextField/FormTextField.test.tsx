import React from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { fireEvent, render, act } from '@testing-library/react';
import { Form } from '..';

interface IForm {
  firstName: string;
}

const onSubmit = jest.fn();
const testId = 'text-field-form';
const fieldLabel = 'First name';
const errorMessage = 'This field is required';

const validate = (values: IForm) => {
  const errors: Partial<IForm> = {};

  if (!values.firstName) {
    errors.firstName = errorMessage;
  }

  return errors;
};

const initialValues: IForm = {
  firstName: '',
};

const renderComponent = () =>
  render(
    <Formik validateOnMount initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      <FormikForm data-testid={testId}>
        <Form.TextField label={fieldLabel} name="firstName" />
      </FormikForm>
    </Formik>,
  );

describe('<Form.TextField />', () => {
  it('handles value change', async () => {
    const { getByTestId, getByLabelText } = renderComponent();
    const value = 'name';
    await act(async () => {
      await fireEvent.change(getByLabelText(fieldLabel), { target: { value } });
    });
    await act(async () => {
      await fireEvent.submit(getByTestId(testId));
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ firstName: value });
  });

  it('renders error message', async () => {
    const { queryByText, getByLabelText } = renderComponent();
    const textField = getByLabelText(fieldLabel);
    await act(async () => {
      await fireEvent.click(textField);
    });
    await act(async () => {
      await fireEvent.blur(textField);
    });
    expect(queryByText(errorMessage)).toBeTruthy();
  });
});
