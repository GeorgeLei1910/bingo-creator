import "./bingo-card.css";
import "../App.css";
import { useState } from "react";

const BingoTile = ({ idx, tileName, formData }) => {
  const size = 600.0 / formData.gridSize;

  const [selected, setSelected] = useState(false);

  const handleOnClick = (e) => {
    setSelected(!selected);
  } 
  return (
    <div
      class="tile"
      style={{ width: size , height: size, background: selected ? 'limegreen' : 'white'}}
      onClick={handleOnClick}
    >
      <h3 style={{ fontSize: '100%', color: formData.fontColor}}>{tileName}</h3> 
    </div>
  );
};

const BingoCard = ({ formData }) => {
  if (!formData) return;

  return (
    <div class="bingo-card" style={{ backgroundImage: `url(${formData.backgroundImage})`}}>
      <h2>{formData.name}</h2>
      <div class="bingo-card">
        {formData.tiles.map((tile, idx) => (
          <>
            <BingoTile tileName={tile} formData={formData}></BingoTile>
            {formData.gridSize == 5 && idx === 11 && <BingoTile idx={idx} tileName={"FREE SPACE"} formData={formData}></BingoTile>}
          </>
        ))}
      </div>
    </div>
  );
};
export default BingoCard;
