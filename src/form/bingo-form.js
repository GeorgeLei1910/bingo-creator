import React from "react";
import "./bingo-form.css";
import { useState } from "react";

const BingoForm = ({ setMainForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    gridSize: "3",
    description: [],
    fontColor: "#000000",
    backgroundImage: null,
  });

  const [descriptionInput, setDescriptionInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (e) => {
    setDescriptionInput(e.target.value);
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

    const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (descriptionInput.trim()) {
        setFormData((prev) => ({
          ...prev,
          description: [...prev.description, descriptionInput] // 👈 Append to array
        }));
        setDescriptionInput(''); // Clear input after adding
      }
    }
  };

  const removeDescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index) // Remove by index
    }));
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

        {/* Description Input Field */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description">Add to Description:</label>
          <input
            type="text"
            id="description"
            placeholder="Type and press Enter"
            value={descriptionInput}
            onChange={handleDescriptionChange}
            onKeyDown={handleDescriptionKeyDown} // Handles Enter key
            style={{ width: '100%' }}
          />
        </div>

        {/* Description List Below Input */}
        {formData.description.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <label>Description List:</label>
            <ul style={{ paddingLeft: '20px' }}>
              {formData.description.map((desc, index) => (
                <li 
                  key={index}
                  onClick={() => removeDescription(index)}>{desc}</li>
              ))}
            </ul>
          </div>
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
