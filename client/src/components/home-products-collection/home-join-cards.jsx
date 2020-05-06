import React from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";
import { AiTwotoneShop } from "react-icons/ai";
import { OptionLink } from "../header/Header-styles";
import { Link } from "react-router-dom";

export const JoinCards = () => {
  return (
    <CardGroup>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>
            <AiTwotoneShop
              style={{ marginRight: "-6px", marginBottom: "2px" }}
            />{" "}
            <OptionLink
              as="a"
              className="hvr-underline-from-center"
              to="/contact"
            >
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to="/signup"
              >
                Shop With Us
              </Link>
            </OptionLink>
          </Card.Title>
          <Card.Text>
            Join our trading systems and start enjoying the best prices and
            product world wide
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>
            <AiTwotoneShop
              style={{ marginRight: "-6px", marginBottom: "2px" }}
            />{" "}
            <OptionLink
              as="div"
              className="hvr-underline-from-center"
              to="/contact"
            >
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to="/category"
              >
                {" "}
                Create Your Own Store
              </Link>
            </OptionLink>
          </Card.Title>
          <Card.Text>
            Join our trading systems to expose you buisness to millions of users
          </Card.Text>
        </Card.Body>
      </Card>
    </CardGroup>
  );
};
