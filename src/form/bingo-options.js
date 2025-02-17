import React from "react";
import "./bingo-form.css";
import { useState, useEffect, useRef } from "react";

const BingoOptions = ({formData, setFormData }) => {

  const [descriptionInput, setDescriptionInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [descriptionInput]);

  const handleDescriptionChange = (e) => {
    setDescriptionInput(e.target.value);
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

  return (
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
        </div>

        {/* Description List Below Input */}
        {formData.description.length > 0 && (
          <div>
          <label>Bingo Options</label>
          <p>Click on an option to remove it</p>
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
    </div>
  );
};

export default BingoOptions;
