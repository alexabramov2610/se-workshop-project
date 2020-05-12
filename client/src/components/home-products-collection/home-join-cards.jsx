import React from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";
import { AiTwotoneShop } from "react-icons/ai";
import { OptionLink } from "../header/Header-styles";
import { Link } from "react-router-dom";

export const JoinCards = ({ isLoggedIn }) => {
  return (
    <CardGroup>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>
            {!isLoggedIn && (
              <AiTwotoneShop
                style={{ marginRight: "6px", marginBottom: "2px" }}
              />
            )}
            {isLoggedIn ? (
              <div style={{ paddingTop: 17 }}>Welcome Back!</div>
            ) : (
              <Link
                as="a"
                className="hvr-underline-from-center"
                to="/signupsignin"
                style={{ textDecoration: "none", color: "black" }}
              >
                Shop With Us
              </Link>
            )}
          </Card.Title>
          <Card.Text>
            {isLoggedIn
              ? " "
              : " Join our trading systems and start enjoying the best prices and product world wide"}
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>
            <AiTwotoneShop
              style={{ marginRight: "6px", marginBottom: "2px" }}
            />{" "}
            <Link
              as="a"
              className="hvr-underline-from-center"
              to="/createstore"
              style={{ textDecoration: "none", color: "black" }}
            >
              Trade With Us
            </Link>
          </Card.Title>
          <Card.Text>
            Join our trading systems to expose you buisness to millions of users
          </Card.Text>
        </Card.Body>
      </Card>
    </CardGroup>
  );
};
