import React from "react";
import Card from "react-bootstrap/Card";
import { AiFillStar } from "react-icons/ai";
import { FiBox } from "react-icons/fi";
import { history } from "../../utils/config";
import { Link } from "react-router-dom";
import { CustomButton } from "../../components/custom-button/custom-button.component";
import * as api from "../../utils/api";
import { CartCtx } from "../../contexts/cart-context";
import { ProductDetails } from "./products-box.styles";
export class ManageProductBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
    };
  }
  async componentDidMount() {
    const { data } = await api.viewProductInfo(this.props.store, this.props.cn);
    const info = data.data.info;
    this.setState({ info });
  }
  handleRemove = async () => {
    await api.removeProduct(this.props.store, this.props.cn);
    window.location.reload();
  };

  render() {
    return (
      <Card classsName="text-center grid-item">
        <Card.Body>
          <Card.Title>
            <FiBox style={{ marginRight: "4px", marginBottom: "2px" }} />
            {this.props.name}
          </Card.Title>
          <ProductDetails>
            <div>Price: {`${this.props.price} ₪`}</div>
            <div>Category: {this.props.category}</div>
            <div>Quantity: {this.state.info.quantity}</div>
            <div>
              Store:{" "}
              <Link to={`/store/${this.props.store}`}>{this.props.store}</Link>
            </div>
            <div>
              Rating :{" "}
              {[1, 2, 3, 4, 5].map(
                (e, index) =>
                  index < this.props.rating && (
                    <AiFillStar key={index} style={{ marginBottom: "2px" }} />
                  )
              )}
            </div>
          </ProductDetails>
        </Card.Body>
        <Card.Footer>
          <CustomButton
            style={{ margin: "auto", marginBottom: 5 }}
            onClick={() =>
              history.push(
                `/store/${this.props.store}/edit-product/${this.props.cn}`
              )
            }
          >
            Edit
          </CustomButton>
          <CustomButton style={{ margin: "auto" }} onClick={this.handleRemove}>
            Remove
          </CustomButton>
        </Card.Footer>
      </Card>
    );
  }
}
