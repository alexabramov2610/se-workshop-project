import { Response } from "../../src/test_env/types";

const DummyResponse: Response = {
  data: {},
};

const DummyItemReposne: Response = {
  data: { name: "dummyItem", price: 33.5, description: "dummyDescription" },
};

const DummyStoreReposne: Response = {
  data: { name: "dummyStore", description: "dummyDescription" },
};

const DummyUsersReposne: Response = {
  data: { users: ["dummyUser1", "dummyUser2", "dummyUser3"] },
};

const DummyUserReposne: Response = {
  data: { username: "dummyUser" },
};
const DummyBuyReposne: Response = {
  data: { recieptId: "some-fake-id" },
};
const DummyPurchaseHistoryResponse: Response = {
  data: { puchases: [{ productName: "some-name" }] },
};
export {
  DummyResponse,
  DummyItemReposne,
  DummyStoreReposne,
  DummyUsersReposne,
  DummyUserReposne,
  DummyBuyReposne,
  DummyPurchaseHistoryResponse,
};
