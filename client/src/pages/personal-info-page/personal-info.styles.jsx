import styled from 'styled-components';

export const CreateStorePageContainer = styled.div`
  width: 850px;
  display: flex;
  justify-content: space-between;
  margin: 30px auto;
`;

export const StoreFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  letter-spacing: 1px;
  margin: auto;
`;

export const Title = styled.h2`
  margin: 10px 0;
`;
export const CreateStoreTitle = styled.h2`
  margin: 10px 0;
`;
export const StoresGridContainer = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
`;
