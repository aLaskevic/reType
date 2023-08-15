import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../api/apiService";
import "./textsection.css";

function TextSection() {
  const [data, setData] = useState([[]]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [markedText, setMarkedText] = useState("");
  const [unmarkedText, setUnmarkedText] = useState("");

  const markedWordsRef = useRef(null);
  const unmarkedWordsRef = useRef(null);

  const handleGlobalClick = (event: KeyboardEvent) => {
    //Shift shouldn't trigger this event
    if (event.key === "Shift") return;

    setIndex(index + 1);
  };

  useEffect(() => {
    setMarkedText(
      (prevMarkedText) => prevMarkedText + unmarkedText.charAt(index)
    );
  }, [index]);

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
          <span ref={markedWordsRef} className="textsection__text--marked">
            {markedText}
          </span>
          <span ref={unmarkedWordsRef} className="textsection__text--unmarked">
            {unmarkedText}
          </span>
        </div>
      )}
    </>
  );
}

export default TextSection;
