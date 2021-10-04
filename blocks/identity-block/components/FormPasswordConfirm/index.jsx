import React, { useState } from 'react';

import FormInputField, { FIELD_TYPES } from '../FormInputField';

const FormPasswordConfirm = ({
  autoComplete,
  confirmLabel,
  confirmPlaceholder,
  confirmTip,
  confirmValidationErrorMessage,
  label,
  name,
  placeholder,
  showDefaultError = false,
  tip,
  validationPattern,
  validationErrorMessage,
}) => {
  const [password, setPassword] = useState('');

  const fieldParameters = {
    ...(placeholder ? { placeholder } : {}),
    ...(showDefaultError ? { showDefaultError } : {}),
    ...(tip ? { tip } : {}),
    ...(validationErrorMessage ? { validationErrorMessage } : {}),
    ...(validationPattern ? { validationPattern } : {}),
    ...(autoComplete ? { autoComplete } : {}),
  };

  const confirmFieldParameters = {
    ...(confirmPlaceholder ? { placeholder: confirmPlaceholder } : {}),
    ...(showDefaultError ? { showDefaultError } : {}),
    ...(confirmTip ? { tip: confirmTip } : {}),
    ...(confirmValidationErrorMessage
      ? { validationErrorMessage: confirmValidationErrorMessage }
      : {}),
    ...(autoComplete ? { autoComplete } : {}),
  };

  return (
    <>
      <FormInputField
        {...fieldParameters}
        label={label}
        name={name}
        onChange={({ value }) => setPassword(value)}
        required
        type={FIELD_TYPES.PASSWORD}
      />
      <FormInputField
        {...confirmFieldParameters}
        label={confirmLabel}
        name={`${name}-confirmation`}
        required
        type={FIELD_TYPES.PASSWORD}
        validationPattern={`^${password}$`}
      />
    </>
  );
};

export default FormPasswordConfirm;
