import React from "react";
import DiscountsSummery from "../../components/discounts-summery/discounts-summery.component";
import SubjectProducts from "../../components/subject-products/subject-products.component";
import DiscountSettings from "../../components/discount-settings/discount-settings.component";

const titles = ["Your Discounts", "Please choose your discount configuration", "Choose Products"];
const screens = [<DiscountsSummery/>, <SubjectProducts/>, <DiscountSettings/>];
const steps = {REVIEW_SUBMIT: 0, SUBJECT_PRODUCTS: 1, EDIT_ADD: 2};
const modes = {EDIT: "edit-mode", ADD: "add-mode"};

const config =  {titles: titles, screens: screens, steps: steps, modes: modes};

export {config};