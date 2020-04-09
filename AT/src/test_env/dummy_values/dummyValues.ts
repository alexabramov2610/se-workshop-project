import { Response } from "../types";

const DummyResponse: Response = {
  success: true,
  data: {},
  error: null,
};

const DummyItemReposne: Response = {
  success: true,
  data: { name: "dummyItem", price: 33.5, description: "dummyDescription" },
  error: null,
};

const DummyStoreReposne: Response = {
  success: true,
  data: { name: "dummyStore", description: "dummyDescription" },
  error: null,
};

const DummyUsersReposne: Response = {
  success: true,
  data: { users: ["dummyUser1", "dummyUser2", "dummyUser3"] },
  error: null,
};

const DummyUserReposne: Response = {
  success: true,
  data: { username: "dummyUser" },
  error: null,
};

export {
  DummyResponse,
  DummyItemReposne,
  DummyStoreReposne,
  DummyUsersReposne,
  DummyUserReposne,
};
