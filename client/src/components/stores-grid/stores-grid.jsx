import React from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import { AiTwotoneShop } from "react-icons/ai";
import myImage from "../../assets/storeimg2.svg";
import { history } from "../../App";
import { OptionLink } from "../header/Header-styles";
const stores = [
  {
    name: "Avishay Dildo's Store",
    description: "Big? Small? Medium? we have the right DILDO for you!",
  },
  { name: "Tal The Fart Store", description: "Buy Smelly Farts" },
  {
    name: "Avishay Dildo's Store",
    description: "Big? Small? Medium? we have the right DILDO for you!",
  },
  { name: "Tal The Fart Store", description: "Buy Smelly Farts" },
  {
    name: "Avishay Dildo's Store",
    description: "Big? Small? Medium? we have the right DILDO for you!",
  },
  { name: "Tal The Fart Store", description: "Buy Smelly Farts" },
  {
    name: "Avishay Dildo's Store",
    description: "Big? Small? Medium? we have the right DILDO for you!",
  },
  { name: "Tal The Fart Store", description: "Buy Smelly Farts" },
  {
    name: "Avishay Dildo's Store",
    description: "Big? Small? Medium? we have the right DILDO for you!",
  },
  { name: "Tal The Fart Store", description: "Buy Smelly Farts" },
  {
    name: "Avishay Dildo's Store",
    description: "Big? Small? Medium? we have the right DILDO for you!",
  },
  { name: "Tal The Fart Store", description: "Buy Smelly Farts" },
  {
    name: "Avishay Dildo's Store",
    description: "Big? Small? Medium? we have the right DILDO for you!",
  },
  { name: "Tal The Fart Store", description: "Buy Smelly Farts" },
];

export const StoresGrid = () => {
  return (
    <div style={{ marginTop: "20px" }}>
      <CardColumns>
        {stores.map((s, index) => (
          <Card className="text-center" key={index}>
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
                  {s.name}
                </OptionLink>
              </Card.Title>
              <Card.Text>{s.description}</Card.Text>
            </Card.Body>
          </Card>
        ))}{" "}
      </CardColumns>
    </div>
  );
};
