import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../api/apiService";
import sound from "../../assets/keyboardPress.mp3";
import "./textsection.css";

function TextSection() {
  const [data, setData] = useState([[]]);
  const [loading, setLoading] = useState(true);
  const [index, _setIndex] = useState(0);
  //   const [page, setPage] = useState(0);
  const [markedText, _setMarkedText] = useState("");
  const [unmarkedText, _setUnmarkedText] = useState("");
  const [mistakes, _setMistakes] = useState(0);

  const myMarkedRef = useRef(markedText);

  function setMarkedText(marked: string) {
    myMarkedRef.current = marked;
    _setMarkedText(marked);
  }

  const myUnmarkedRef = useRef(unmarkedText);

  function setUnmarkedText(unmarked: string) {
    myUnmarkedRef.current = unmarked;
    _setUnmarkedText(unmarked);
  }

  const myIndexRef = useRef(index);

  function setIndex(index: number) {
    myIndexRef.current = index;
    _setIndex(index);
  }

  const myMistakesRef = useRef(mistakes);

  function setMistakes(mistakes: number) {
    myMistakesRef.current = mistakes;
    _setMistakes(mistakes);
  }

  const handleGlobalClick = (event: KeyboardEvent) => {
    //Shift shouldn't trigger this event
    if (event.key == "Shift") return;

    console.log(
      myUnmarkedRef.current.charAt(0),
      event.key,
      myUnmarkedRef.current.charAt(myIndexRef.current) === event.key,
      myIndexRef.current
    );

    if (myUnmarkedRef.current.charAt(0) === event.key) {
      var audio = new Audio(sound);
      audio.volume = 0.5;
      audio.play();

      const newMarked = myMarkedRef.current + event.key;
      setMarkedText(newMarked);

      const newIndex = myIndexRef.current + 1;
      setIndex(newIndex);

      const newUnmarked = myUnmarkedRef.current.slice(1);

      console.log(newUnmarked);
      setUnmarkedText(newUnmarked);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const response = await fetchData("/word?number=500&lang=de");

        const subListData = [];
        const subListSize = 10;
        for (let i = 0; i < response.length; i += subListSize) {
          const sublist = response.slice(i, i + subListSize);
          subListData.push(sublist);
        }

        setData(subListData);
        setUnmarkedText(subListData[0].join(" "));
      } catch (error) {
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
    document.addEventListener("keyup", handleGlobalClick);

    return () => {
      document.removeEventListener("keyup", handleGlobalClick);
    };
  }, []);

  return (
    <>
      {loading ? (
        <div> Am Laden</div>
      ) : (
        <div className="textsection">
          <span className="textsection__text--marked">{markedText}</span>
          <span className="textsection__text--unmarked">{unmarkedText}</span>
        </div>
      )}
    </>
  );
}

export default TextSection;
