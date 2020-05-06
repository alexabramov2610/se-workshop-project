import React from "react";
import { Link } from "react-router-dom";
import DeepInside from "./deep-component";
import { JoinCards } from "../../components/home-products-collection/home-join-cards";
import { CarouselUI } from "../../components/carousel/carousel";
import { StoresGrid } from "../../components/stores-grid/stores-grid";
const HomePage = () => {
  return (
    <div>
      <CarouselUI />
      <JoinCards />
      <StoresGrid />
    </div>
  );
};

export default HomePage;
