import React from "react";
import "./bingo-form.css";
import { useState } from "react";

const BingoForm = ({ setMainForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    gridSize: "3",
    description: "",
    fontColor: "#000000",
    backgroundImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {

    const file = e.target.files[0];
    if (file == null) return;
        var reader = new FileReader();        
        reader.readAsDataURL( file );
        reader.onloadend = function(){
          setFormData({
            ...formData,
            backgroundImage: this.result,
          });
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMainForm({...formData});
  };

  return (
    <div class="bingo-cell">
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        {/* Name Input */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{ width: "100%" }}
          />
        </div>

        {/* Grid Size Radio Buttons */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Grid Size:</label>
          <div>
            <label>
              <input
                type="radio"
                name="gridSize"
                value="3"
                checked={formData.gridSize === "3"}
                onChange={handleInputChange}
              />
              3 x 3
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name="gridSize"
                value="4"
                checked={formData.gridSize === "4"}
                onChange={handleInputChange}
              />
              4 x 4
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name="gridSize"
                value="5"
                checked={formData.gridSize === "5"}
                onChange={handleInputChange}
              />
              5 x 5
            </label>
          </div>
        </div>

        {/* Description Text Area */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="15"
            style={{ width: "400px" }}
          ></textarea>
        </div>

        {/* Font Color Selector */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="fontColor">Font Color:</label>
          <input
            type="color"
            id="fontColor"
            name="fontColor"
            value={formData.fontColor}
            onChange={handleInputChange}
          />
        </div>

        {/* Background Image Selector */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="backgroundImage">Background Image:</label>
          <input
            type="file"
            id="backgroundImage"
            name="backgroundImage"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" style={{ width: "100%" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default BingoForm;
