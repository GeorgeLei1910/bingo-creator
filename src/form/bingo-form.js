import React from "react";
import "./bingo-form.css";
import { useState } from "react";
import BingoOptions from "./bingo-options";

const BingoForm = ({ setMainForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    gridSize: "3",
    description: [],
    fontColor: "#000000",
    backgroundImage: null,
  });

  const [tileOptions, setTileOptions] = useState("Numbers");

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
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setFormData({
        ...formData,
        backgroundImage: this.result,
      });
    };
  };

  const handleGridSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      gridSize: size,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMainForm({ ...formData, description: tileOptions === "Custom" ? formData.description : Array.from({ length: 100 }, (_, index) => index + 1) });
  };

  return (
    <div class="bingo-cell">
      <h2>myobingo.ca</h2>
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
          <div style={{ display: "flex", gap: "10px" }}>
            {[3, 4, 5].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleGridSizeChange(size)}
                style={{
                  padding: "8px 12px",
                  border: "2px solid",
                  borderColor: formData.gridSize === size ? "blue" : "gray",
                  background:
                    formData.gridSize === size ? "lightblue" : "white",
                  cursor: "pointer",
                }}
              >
                {size} x {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bingo Options Radio Buttons */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Tile Options:</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {["Numbers", "Custom"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTileOptions(option)}
                style={{
                  padding: "8px 12px",
                  border: "2px solid",
                  borderColor: tileOptions === option ? "blue" : "gray",
                  background:
                    tileOptions === option ? "lightblue" : "white",
                  cursor: "pointer",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {tileOptions === "Custom" && (
          <BingoOptions
            formData={formData}
            setFormData={setFormData}
          ></BingoOptions>
        )}

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
