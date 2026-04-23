import React from "react";
import "./bingo-form.css";
import { useState, useEffect, useRef } from "react";

const BingoOptions = ({ formData, setFormData }) => {
  const [descriptionInput, setDescriptionInput] = useState("");
  const [clearClicks, setClearClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [descriptionInput]);

  const handleDescriptionChange = (e) => {
    setDescriptionInput(e.target.value);
  };


  const handleClearDescription = (e) => {

    e.preventDefault();
    const now = Date.now();

    if (clearClicks === 0 || now - lastClickTime <= 2000) {
      setClearClicks((prev) => prev + 1);
      setLastClickTime(now);

      if (clearClicks + 1 === 3) {
        setFormData((prev) => ({
          ...prev,
          tiles: [], // ✅ Clears the entire description list
        }));
        setClearClicks(0); // ✅ Reset counter
        setLastClickTime(0);
      }
    } else {
      setClearClicks(1); // Reset counter if time gap is too long
      setLastClickTime(now);
    }
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (e.shiftKey) {
        setDescriptionInput((prev) => prev + "\n");
      } else {
        const newDesc = descriptionInput
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "");
        setFormData((prev) => ({
          ...prev,
          tiles: [...prev.tiles, ...newDesc],
        }));
        setDescriptionInput("");
      }
    }
  };

  const removeDescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      tiles: prev.tiles.filter((_, i) => i !== index), // Remove by index
    }));
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="tiles">Add to Tile Options:</label>
      <div>
        <textarea
          id="tiles"
          placeholder="Type and press Enter to add, Shift + Enter for new line"
          value={descriptionInput}
          onChange={handleDescriptionChange}
          onKeyDown={handleDescriptionKeyDown} // Handles Enter key
          ref={textareaRef}
        />
      </div>

      {/* Description List Below Input */}
      {formData.tiles.length > 0 && (
        <div>
          <label>Bingo Options</label>
          <p>Click on an option to remove it</p>
          <button
            onClick={handleClearDescription}
            style={{
              marginTop: "10px",
              background: clearClicks >= 2 ? "darkred" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Clear All ({3 - clearClicks} clicks left)
          </button>{" "}
          <div class="options-list" style={{ marginBottom: "1rem" }}>
            {formData.tiles.map((desc, index) => (
              <div
                class="option-item"
                key={index}
                onClick={() => removeDescription(index)}
              >
                {desc}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BingoOptions;
