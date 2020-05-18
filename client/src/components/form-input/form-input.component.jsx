import React from "react";

import {
  GroupContainer,
  FormInputContainer,
  FormTextareaContainer,
  FormInputLabel
} from "./form-input.styles";

const FormInput = ({ handleChange, label, isScrollable, ...props }) => (
  <GroupContainer>
    {isScrollable ? (
      <FormTextareaContainer onChange={handleChange} {...props} />
    ) : (
      <FormInputContainer onChange={handleChange} {...props} />
    )}
    {label ? (
      <FormInputLabel className={props.value && props.value.length ? "shrink" : ""}>
        {label}
      </FormInputLabel>
    ) : null}
  </GroupContainer>
);

export default FormInput;
