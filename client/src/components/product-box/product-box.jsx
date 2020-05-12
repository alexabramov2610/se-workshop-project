import React from "react";
import Card from "react-bootstrap/Card";
import { AiFillStar } from "react-icons/ai";
import { FiBox } from "react-icons/fi";
import { history } from "../../utils/config";
import { CustomButton } from "../../components/custom-button/custom-button.component";
import * as api from "../../utils/api";

export const ProductBox = (props) => (
  <Card className="text-center grid-item">
    <Card.Body>
      <Card.Title>
        <FiBox style={{ marginRight: "4px", marginBottom: "2px" }} />
        {props.name}
      </Card.Title>
      <Card.Text>
        <div>Price: {props.price}</div>
        <div>
          Rating:{" "}
          {[1, 2, 3, 4, 5].map(
            (e, index) =>
              index < props.rating && (
                <AiFillStar style={{ marginBottom: "2px" }} />
              )
          )}
        </div>
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <CustomButton style={{ margin: "auto" }}>Add To Cart</CustomButton>
    </Card.Footer>
  </Card>
);
