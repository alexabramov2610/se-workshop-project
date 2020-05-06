import styled, { css } from "styled-components";

const subColor = "grey";
const mainColor = "black";

const shrinkLabelStyles = css`
  top: -14px;
  font-size: 15px;
  color: ${mainColor};
`;

export const GroupContainer = styled.div`
  position: relative;
  margin: 45px 0;

  input[type="password"] {
    letter-spacing: 0.3em;
  }
`;

const scrollableStyle = css`
  resize: none;

  &:focus {
    outline: none;
    min-height: 250px;
  }
  &:focus ~ label {
    ${shrinkLabelStyles}
  }
`;

const nonScrollableStyle = css`
  border-radius: 0;

  &:focus {
    outline: none;
  }

  &:focus ~ label {
    ${shrinkLabelStyles}
  }
`;

const basicStyles = css`
  padding: 10px 10px 10px 5px;
  background: none;
  background-color: white;
  color: ${subColor};
  font-size: 20px;
  display: block;
  width: 100%;
  margin: 25px 0;
  border: none;
  min-height: 40px;
  border-bottom: 1px solid ${subColor};
  transition: 500ms ease all;
`;

export const FormInputContainer = styled.input`
  ${basicStyles}
  ${nonScrollableStyle}
`;

export const FormTextareaContainer = styled.textarea`
  ${basicStyles}
  ${scrollableStyle}
`;

export const FormInputLabel = styled.label`
  color: ${subColor};
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 300ms ease all;

  &.shrink {
    ${shrinkLabelStyles}
  }
`;
