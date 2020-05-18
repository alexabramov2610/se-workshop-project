import styled from 'styled-components';

export const CreateTableContainer = styled.div`
    display: ${({disabled}) => disabled ? "none" : ""}
    height: 400px;
    overflow-y: auto
`