import React from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import { AiTwotoneShop } from "react-icons/ai";
import myImage from "../../assets/storeimg2.svg";
import { history } from "../../utils/config";
import { OptionLink } from "../header/Header-styles";
import * as api from "../../utils/api";
import { StoresGridContainer } from "./stores-grid-container.styles.jsx";
const stores = [];
export class StoresGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    const { data } = await api.getStores();
    const { stores } = data.data;
    this.setState({ stores });
    console.log(stores);
  }

  render() {
    return (
      <StoresGridContainer>
        {this.state.stores &&
          this.state.stores.map((s, index) => (
            <Card className="text-center grid-item" key={index}>
              <Card.Img height="180px" src={myImage} />
              <Card.Body>
                <Card.Title>
                  <AiTwotoneShop
                    style={{ marginRight: "-8px ", marginBottom: "2px" }}
                  />
                  <OptionLink
                    as="div"
                    className="hvr-underline-from-center"
                    to="/contact"
                    onClick={() => history.push("/signupsignin")}
                  >
                    {s.storeName}
                  </OptionLink>
                </Card.Title>
                <Card.Text>{s.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}{" "}
      </StoresGridContainer>
    );
  }
}
