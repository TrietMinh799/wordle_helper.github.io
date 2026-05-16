import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pagination from "./components/Pagination";
import Word from "./components/Word";

const boxIndex = [0, 1, 2, 3, 4];

function App() {
  const [green, setGreen] = useState(["", "", "", "", ""]);
  const [yellow, setYellow] = useState(["", "", "", "", ""]);
  const [black, setBlack] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [wordList, setWordList] = useState([]);
  const inputRef = useRef([]);

  const prev = black.length;
  const curr = [...green];
  const postPerPage = 10;

  const preprocess = async () => {
    const cachedList = localStorage.getItem("wordleList");
    if (cachedList) {
      setWordList(JSON.parse(cachedList));
      return;
    }
    fetch("https://raw.githubusercontent.com/tabatkins/wordle-list/main/words")
      .then((res) => res.text())
      .then((data) => {
        setWordList(data.split("\n"));
      })
      .then(() => {
        localStorage.setItem("wordleList", JSON.stringify(wordList));
      });
  };

  const handleKeyNext = (e, index) => {
    if (e.value && index < 4) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !green[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").split("");
    if (data.length === 5) {
      setGreen(data);
      inputRef.current[4].focus();
    }
  };

  const handleGreen = (index, value) => {
    let new_word = curr;
    new_word[index] = value.value;
    setGreen(new_word);
    handleKeyNext(value, index);

    let new_wordlist = JSON.parse(localStorage.getItem("wordleList"));
    if (value.value === "") {
      console.log(curr);
      for (let i = 0; i < 5; i++) {
        if (curr[i] !== "") {
          new_wordlist = new_wordlist.filter((word) => {
            return word[i] === curr[i];
          });
        }
      }
      setWordList(new_wordlist);
    } else {
      new_wordlist = wordList.filter((word) => {
        return word[index] === value.value;
      });
      setWordList(new_wordlist);
    }
  };

  const handleYellow = (index, value) => {
    let new_wordlist = JSON.parse(localStorage.getItem("wordleList"));
    new_wordlist = new_wordlist.filter((word) => {
      return word.includes(value.value) && word[index] !== value.value;
    });
    setWordList(new_wordlist);
  };

  const handleBlack = (e) => {
    let current = e.target.value.length;
    if (current < prev) {
      let new_discard = black.slice(0, black.length - 1);
      setBlack(new_discard);
      setWordList(JSON.parse(localStorage.getItem("wordleList")));
    } else {
      setBlack([...black, e.target.value.at(-1)]);

      let new_wordlist = wordList.filter((word) => {
        return !word.includes(e.target.value.at(-1));
      });
      setWordList(new_wordlist);
    }
  };

  useEffect(() => {
    preprocess();
  }, []);

  return (
    <div className="App">
      <div className="guessing">
        <div className="correct-container">
          <p className="header">Correct characters: </p>
          {boxIndex.map((index) => (
            <input
              key={index}
              className="correct"
              name={`green${index + 1}`}
              type="text"
              id={`green${index + 1}`}
              maxLength={1}
              ref={(el) => (inputRef.current[index] = el)}
              onChange={(e) => {
                handleGreen(index, e.target);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e, index);
              }}
              onPaste={handlePaste}
            />
          ))}
        </div>
        <div className="wrong-container">
          <p className="header">Wrong position (but right characters)</p>
          {boxIndex.map((index) => (
            <input
              key={index}
              className="correct wrong"
              name={`yellow${index + 1}`}
              type="text"
              id={`yellow${index + 1}`}
              maxLength={1}
              onChange={(e) => {
                handleYellow(index, e.target);
              }}
            />
          ))}
        </div>
        <div className="discard-container">
          <p>Discard characters</p>
          <input
            name="discard"
            type="text"
            id="discard"
            onChange={(e) => {
              handleBlack(e);
            }}
          />
        </div>
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
