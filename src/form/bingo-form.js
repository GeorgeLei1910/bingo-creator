import React from "react";
import "./bingo-form.css";
import { useState, useEffect, useRef } from "react";

const BingoForm = ({ setMainForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    gridSize: "3",
    description: [],
    fontColor: "#000000",
    backgroundImage: null,
  });
  const [descriptionInput, setDescriptionInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize the textarea when content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
    }
  }, [descriptionInput]);

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
      if (e.shiftKey){
        setDescriptionInput((prev) => prev + '\n');
      } else {
        const newDesc = descriptionInput
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '');
        setFormData((prev) => ({
          ...prev,
          description: [...prev.description, ...newDesc] 
        }));
        setDescriptionInput(''); 
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
    setDescriptionInput('');
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
        <div >
          <textarea
            id="description"
            placeholder="Type and press Enter to add, Shift + Enter for new line"
            value={descriptionInput}
            onChange={handleDescriptionChange}
            onKeyDown={handleDescriptionKeyDown} // Handles Enter key
            ref={textareaRef}
          />
        </div></div>

        {/* Description List Below Input */}
        {formData.description.length > 0 && (
          <div>
          <label>Bingo Options</label>
          <div class="options-list" style={{ marginBottom: '1rem' }}>
            {formData.description.map((desc, index) => (
              <div 
                class="option-item"
                key={index}
                onClick={() => removeDescription(index)}>{desc}</div>
            ))}
          </div>
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
