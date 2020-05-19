import React from "react";
import { Form } from "semantic-ui-react";
import { PayFormContainer } from "./pay-form.styles";
import { BuySuccess } from "../BuyFeedBack/buyfeedback.component";
import * as api from "../../utils/api";
import { CustomButton } from "../../components/custom-button/custom-button.component";
export class PayForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { buySucc: false };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    console.log(this.state);
    this.setState({ [name]: value });
  };
  async handleSubmit() {
    console.log("hopa");
    const {
      holderName,
      country,
      city,
      street,
      homeNumber,
      total,
      exp,
      ccnumber,
      cvv,
    } = this.state;
    const expMonth = exp.split("/")[0];
    const expYear = exp.split("/")[1];
    const req = {
      body: {
        payment: {
          cardDetails: {
            holderName: holderName,
            number: ccnumber,
            expMonth,
            expYear,
            cvv,
          },
          address: street + homeNumber,
          city,
          country,
        },
        total,
      },
    };
    const { data } = await api.purchase(req);
    if (data.data.result) {
      this.setState({ buySucc: true });
      await this.props.cartCountUpdater();
    } else {
      alert("something went wrong");
    }
  }

  render() {
    return this.state.buySucc ? (
      <BuySuccess />
    ) : (
      <PayFormContainer>
        <Form>
          <Form.Group>
            <Form.Input
              onChange={this.handleChange}
              label="Holder Name"
              name="holderName"
              placeholder="Holder Name"
              width={6}
            />
            <Form.Input
              onChange={this.handleChange}
              label="Country"
              name="country"
              placeholder="Country"
              width={4}
            />
            <Form.Input
              onChange={this.handleChange}
              label="City"
              name="city"
              placeholder="City"
              width={6}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              onChange={this.handleChange}
              label="Street"
              name="street"
              placeholder="Street"
              width={8}
            />
            <Form.Input
              onChange={this.handleChange}
              label="Number"
              name="homeNumber"
              placeholder="Number"
              width={2}
            />
            <Form.Input
              onChange={this.handleChange}
              label="Total Amount"
              name="total"
              placeholder="Total Amount"
              width={6}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              onChange={this.handleChange}
              label="Exp."
              name="exp"
              placeholder="mm/yy"
              width={2}
            />
            <Form.Input
              onChange={this.handleChange}
              label="Card Number"
              name="ccnumber"
              placeholder="Card Number"
              width={12}
            />
            <Form.Input
              onChange={this.handleChange}
              label="CVV"
              name="cvv"
              placeholder="- - - "
              width={2}
            />
          </Form.Group>
        </Form>
        <CustomButton onClick={() => this.handleSubmit()}>Pay!</CustomButton>
      </PayFormContainer>
    );
  }
}
