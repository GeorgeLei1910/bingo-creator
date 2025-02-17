import "./bingo-card.css";
import "../App.css";
import { useState } from "react";

const minTiles = {
  3: 9,
  4: 16,
  5: 24,
};

const BingoTile = ({ idx, tileName, formData }) => {
  const size = 600.0 / formData.gridSize;

  const [selected, setSelected] = useState(false);

  const x = idx / formData.gridSize;
  const y = idx % formData.gridSize;

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
  let tiles = [];
  if (formData.description) {
    tiles = formData.description;
  }
  const noTiles = minTiles[formData.gridSize];
  if (noTiles > tiles.length) {
    alert("At least " + noTiles + " tiles needed! You only have " + tiles.length);
    return;
  }
  const shuffled = tiles.sort(() => 0.5 - Math.random());
  let selected = shuffled.slice(0, noTiles);

  return (
    <div class="bingo-cell" style={{ backgroundImage: `url(${formData.backgroundImage})`}}>
      <h2>{formData.name}</h2>
      <div class="bingo-card">
        {selected.map((tile, idx) => (
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
