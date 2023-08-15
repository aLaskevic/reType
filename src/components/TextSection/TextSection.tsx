import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../api/apiService";
import "./textsection.css";

function TextSection() {
  const [data, setData] = useState([[]]);
  const [loading, setLoading] = useState(true);
  const [index, _setIndex] = useState(0);
  //   const [page, setPage] = useState(0);
  const [markedText, _setMarkedText] = useState("");
  const [unmarkedText, _setUnmarkedText] = useState("");

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

  const handleGlobalClick = (event: KeyboardEvent) => {
    //Shift shouldn't trigger this event
    if (event.key === "Shift") return;

    console.log(data);

    console.log(
      myUnmarkedRef.current.charAt(myIndexRef.current),
      event.key,
      myUnmarkedRef.current.charAt(myIndexRef.current) === event.key,
      myIndexRef.current
    );

    if (myUnmarkedRef.current.charAt(myIndexRef.current) === event.key) {
      const newMarked = myMarkedRef.current + event.key;
      setMarkedText(newMarked);

      const newIndex = myIndexRef.current + 1;
      setIndex(newIndex);

      const newUnmarked = myUnmarkedRef.current.slice(myIndexRef.current);

      console.log(newUnmarked);
      setUnmarkedText(newUnmarked);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const response = await fetchData("/word?number=500&lang=de");

        const subListData = [];
        const subListSize = 25;
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
