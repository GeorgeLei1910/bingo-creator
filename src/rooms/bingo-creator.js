import React from "react";
import "./bingo-creator.css";
import { useState } from "react";
import BingoForm from "./bingo-form";
import BingoCard from "./bingo-card";
import Header from "./header";

const BingoCreator = ({ setMainForm }) => {
  const [formData, setFormData] = useState({});

  return (
    <div>
      <Header></Header>
      <div class="bingo-creator">
        <BingoForm setMainForm={setFormData}></BingoForm>
        {formData.tiles?.length > 0 && <BingoCard formData={formData}></BingoCard>}
      </div>
    </div>
  );
};

export default BingoCreator;
