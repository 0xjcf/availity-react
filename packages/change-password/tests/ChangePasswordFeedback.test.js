import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import ChangePassword, { ChangePasswordForm } from '..';

jest.mock('@availity/api-axios');

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('ChangePasswordFeedback', () => {
  it('renders change password feedback', async () => {
    const me = { userId: 'twarner' };
    const conditions = [
      {
        message: 'Have 8 to 16 characters',
        passes: ({ newPassword }) => /^.{8,16}$/.test(newPassword),
      },
      {
        message: 'Have a number',
        passes: ({ newPassword }) => /\d/.test(newPassword),
      },
      {
        message: 'Have an uppercase letter',
        passes: ({ newPassword }) => /[A-Z]/.test(newPassword),
      },
      {
        message: 'Have a lowercase letter',
        passes: ({ newPassword }) => /[a-z]/.test(newPassword),
      },
      {
        message: 'Have a special character',
        passes: ({ newPassword }) => /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/.test(newPassword),
      },
      {
        message: 'Not contain your user Id',
        passes: ({ newPassword }) => new RegExp(`^((?!${me.userId}).)*$`).test(newPassword),
      },
      {
        message: 'Not contain spaces',
        passes: ({ newPassword }) => /^\S*$/.test(newPassword),
      },
      {
        message: 'This one should always display the empty circle',
        passes: () => null,
      },
    ];

    const resource = { changePassword: jest.fn() };
    const { getByTestId } = render(
      <ChangePassword resource={resource} conditions={conditions}>
        <ChangePasswordForm />
      </ChangePassword>
    );

    const newPasswordInput = getByTestId('new-password-input');

    await fireEvent.change(newPasswordInput, {
      target: {
        name: 'newPassword',
        value: 'twarnerpassword1',
      },
    });

    // Ensure appropriate circles render
    expect(getByTestId('ok-circle-Have 8 to 16 characters')).toBeDefined();
    expect(getByTestId('ok-circle-Have a number')).toBeDefined();
    expect(getByTestId('cancel-circle-Have an uppercase letter')).toBeDefined();
    expect(getByTestId('ok-circle-Have a lowercase letter')).toBeDefined();
    expect(getByTestId('cancel-circle-Have a special character')).toBeDefined();
    expect(getByTestId('cancel-circle-Not contain your user Id')).toBeDefined();
    expect(getByTestId('ok-circle-Not contain spaces')).toBeDefined();
    expect(getByTestId('circle-empty-This one should always display the empty circle')).toBeDefined();
  });
});
