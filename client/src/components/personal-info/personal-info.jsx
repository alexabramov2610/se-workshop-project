import React from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";
import { AiTwotoneShop } from "react-icons/ai";
import { Link } from "react-router-dom";

export const PersonalInfo = () => {
    return (
        <CardGroup>
            <Card className="text-center">
                <Card.Body>
                    <Card.Title>
                            <div style={{ paddingTop: 17 }}>Welcome Back!</div>
                    </Card.Title>
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
