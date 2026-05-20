import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pagination from "./components/Pagination";
import Word from "./components/Word";

const boxIndex = [0, 1, 2, 3, 4];
const emptyBoxes = ["", "", "", "", ""];

function App() {
  const [green, setGreen] = useState(emptyBoxes);
  const [yellow, setYellow] = useState(emptyBoxes);
  const [black, setBlack] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allWords, setAllWords] = useState([]);
  const [wordList, setWordList] = useState([]);

  const greenInputRef = useRef([]);
  const yellowInputRef = useRef([]);

  const postPerPage = 10;

  const preprocess = async () => {
    const cachedList = localStorage.getItem("wordleList");
    if (cachedList) {
      const parsedList = JSON.parse(cachedList);
      setAllWords(parsedList);
      return;
    }

    fetch("https://raw.githubusercontent.com/tabatkins/wordle-list/main/words")
      .then((res) => res.text())
      .then((data) => {
        const parsedList = data.split("\n");
        setAllWords(parsedList);
        localStorage.setItem("wordleList", JSON.stringify(parsedList));
      });
  };

  const filterWords = (words, greenLetters, yellowLetters, blackLetters) => {
    return words.filter((word) => {
      const matchesGreen = greenLetters.every((letter, index) => {
        return letter === "" || word[index] === letter;
      });

      const matchesYellow = yellowLetters.every((letter, index) => {
        return (
          letter === "" || (word.includes(letter) && word[index] !== letter)
        );
      });

      const matchesBlack = blackLetters.every((letter) => {
        return !word.includes(letter);
      });

      return matchesGreen && matchesYellow && matchesBlack;
    });
  };

  const updateBoxLetters = ({ index, rawValue, letters, setLetters, refs }) => {
    const nextValue = rawValue.slice(-1).toLowerCase();
    const nextLetters = [...letters];
    nextLetters[index] = nextValue;
    setLetters(nextLetters);

    if (nextValue !== "" && index < boxIndex.length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleBoxKeyDown = (event, index, letters, refs) => {
    if (event.key === "Backspace" && !letters[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === "") {
    }
  };

  const handlePaste = (event) => {
    const data = event.clipboardData
      .getData("text")
      .slice(0, boxIndex.length)
      .toLowerCase()
      .split("");

    if (data.length === boxIndex.length) {
      setGreen(data);
      greenInputRef.current[boxIndex.length - 1]?.focus();
    }
  };

  const handleGreenChange = (index, value) => {
    updateBoxLetters({
      index,
      rawValue: value,
      letters: green,
      setLetters: setGreen,
      refs: greenInputRef,
    });
  };

  const handleYellowChange = (index, value) => {
    updateBoxLetters({
      index,
      rawValue: value,
      letters: yellow,
      setLetters: setYellow,
      refs: yellowInputRef,
    });
  };

  const handleBlack = (event) => {
    const letters = event.target.value.toLowerCase().split("");
    setBlack(letters);
  };

  useEffect(() => {
    preprocess();
  }, []);

  useEffect(() => {
    if (allWords.length === 0) {
      return;
    }

    setWordList(filterWords(allWords, green, yellow, black));
    setCurrentPage(1);
  }, [allWords, green, yellow, black]);

  return (
    <div className="App">
      <div className="guessing">
        <div className="correct-container">
          <p className="header">Correct characters: </p>
          <div className="input-row">
            {boxIndex.map((index) => (
              <input
                key={index}
                className="correct"
                name={`green${index + 1}`}
                type="text"
                id={`green${index + 1}`}
                maxLength={1}
                value={green[index]}
                ref={(el) => (greenInputRef.current[index] = el)}
                onChange={(e) => {
                  handleGreenChange(index, e.target.value);
                }}
                onKeyDown={(e) => {
                  handleBoxKeyDown(e, index, green, greenInputRef);
                }}
                onPaste={handlePaste}
              />
            ))}
          </div>
        </div>
        <div className="wrong-container">
          <p className="header">Wrong position (but right characters)</p>
          <div className="input-row">
            {boxIndex.map((index) => (
              <input
                key={index}
                className="correct wrong"
                name={`yellow${index + 1}`}
                type="text"
                style={{ color: "white" }}
                id={`yellow${index + 1}`}
                maxLength={1}
                value={yellow[index]}
                ref={(el) => (yellowInputRef.current[index] = el)}
                onChange={(e) => {
                  handleYellowChange(index, e.target.value);
                }}
                onKeyDown={(e) => {
                  handleBoxKeyDown(e, index, yellow, yellowInputRef);
                }}
              />
            ))}
          </div>
        </div>
        <div className="discard-container">
          <p>Discard characters</p>
          <input
            name="discard"
            type="text"
            id="discard"
            value={black.join("")}
            onChange={handleBlack}
          />
        </div>
        <a
          href="https://www.nytimes.com/games/wordle"
          target="_blank"
          rel="noopener noreferrer"
        >
          Play Wordle
        </a>
      </div>
      <div className="word-list">
        <p className="header">Possible words: </p>
        <div className="words-container">
          {wordList
            .slice((currentPage - 1) * postPerPage, currentPage * postPerPage)
            .map((word, index) => {
              return <Word key={index} content={word} />;
            })}
        </div>
        <Pagination
          wordLength={wordList.length}
          postPerPage={postPerPage}
          page={currentPage}
          setPage={setCurrentPage}
          limitPagesPagination={10}
        />
      </div>
    </div>
  );
}

export default App;
