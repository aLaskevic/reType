import { useState } from "react";
import "./App.css";
import Headline from "./components/Headline/Headline";
import TextSection from "./components/TextSection/TextSection";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Headline />
      <TextSection />
    </>
  );
}

export default App;
