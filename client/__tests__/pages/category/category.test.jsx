import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
describe("Category Page", () => {
  beforeEach(() => {});
  test("should render the category page", () => {
    const renderResult = render(<TestContainer />);
    const ans = renderResult.getByTestId("category-page", { exact: true });
    expect(ans).toBeDefined();
  });
});

class TestContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  render(props) {
    return this.state.show ? <TestThis /> : <div />;
  }
}
const TestThis = () => {
  return <span data-testid="category-page"> THIS</span>;
};
