import "./App.css";
import BingoForm from "./form/bingo-form";
import BingoCard from "./form/bingo-card";
import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({});

  return (
    <div class="main">
      <BingoForm setMainForm={setFormData}></BingoForm>
      { formData.description && <BingoCard formData={formData}></BingoCard>}
    </div>
  );
}

export default App;
