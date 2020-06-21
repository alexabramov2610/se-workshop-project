import React from "react";
import { Dropdown } from "semantic-ui-react";
import * as api from "../../utils/api";
import { throttle, debounce } from "throttle-debounce";
import SearchSelect from "../search-select/search-select.component";

export class SearchWithDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { q: "" };
    this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch);
    this.autocompleteSearchThrottled = throttle(500, this.autocompleteSearch);
    this.changeQuery = this.changeQuery.bind(this);
  }

  changeQuery = (event) => {
    this.setState({ q: event }, () => {
      const q = this.state.q;
      if (q.length < 5) {
        this.autocompleteSearchThrottled(this.state.q);
      } else {
        this.autocompleteSearchDebounced(this.state.q);
      }
    });
  };

  autocompleteSearch = (q) => {
    this._fetch(q);
  };

  _fetch = async (q) => {
    if (q.length > 0) {
      const { data } = await api.getProductsNames(q, 10);
      console.log(data);
      const items = data.data.names;
      console.log(items);
      this.setState({ items });
    } else {
      this.setState({ items: [] });
    }
  };

  render() {
    const _searches = this.state._searches || [];
    return (
      <div>
        <SearchSelect
          onSearch={this.changeQuery}
          options={
            (this.state.items &&
              this.state.items.map((item) => {
                return { value: item };
              })) || [{ value: "giu" }]
          }
          initialValue={[]}
        />
      </div>
    );
  }
}
