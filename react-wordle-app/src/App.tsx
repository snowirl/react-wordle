import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Keyboard from "./components/Keyboard";
import WordRow from "./components/WordRow";
import { WordleWord } from "../typings.ts";
import { useEffect } from "react";
import toast, { Toaster, resolveValue } from "react-hot-toast";

// https://wordle-api.cyclic.app/words WORDLE API

function App() {
  const [row, setRow] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [data, setData] = useState<WordleWord[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [correctWord, setCorrectWord] = useState<string>("Space");
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [foundLetters, setFoundLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const congratsText = [
    "Genius",
    "Magnificent",
    "Impressive",
    "Splendid",
    "Great",
    "Phew",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      const key = event.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        handleLetterClick(key);
      } else if (key === "backspace") {
        // Handle backspace key
        handleBack();
      } else if (key === "enter") {
        handleEnter();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedLetters, row]);

  const fetchData = async () => {
    try {
      // Fetch data from an API endpoint
      const response = await fetch("https://wordle-api.cyclic.app/words");

      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse response data
      const responseData = (await response.json()) as WordleWord[];

      // Set fetched data to state
      console.log(responseData);
      setData(responseData);

      const currentDate: Date = new Date();
      const currentDayOfYear: number =
        Math.floor(
          (currentDate.getTime() -
            new Date(currentDate.getFullYear(), 0, 0).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1; // Adding 1 because the first day of the year is 1, not 0

      setCorrectWord(responseData[currentDayOfYear].word.toUpperCase());
      console.log(responseData[currentDayOfYear].word);

      setIsLoading(false);
    } catch (error) {
      // Handle errors
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleLetterClick = (letter: string) => {
    if (row > 5 || gameOver) {
      return;
    }
    if (selectedLetters.length < (row + 1) * 5) {
      setSelectedLetters([...selectedLetters, letter.toUpperCase()]);
    }

    console.log(letter);
    console.log(selectedLetters);
  };

  const handleBack = () => {
    if (gameOver) {
      return;
    }
    if ((row + 0) * 5 < selectedLetters.length) {
      setSelectedLetters((prevSelectedLetters) =>
        prevSelectedLetters.slice(0, -1)
      );
    }
  };

  const handleEnter = () => {
    if (row > 5 || gameOver) {
      return;
    }

    if (data !== null) {
      const letters = selectedLetters.slice(row * 5, (row + 1) * 5);
      const word = letters.join("").toLowerCase();

      if (word.length < 5) {
        toast("Not enough letters");
        return;
      }

      console.log(word);

      if (data.some((e) => e.word === word)) {
        console.log("FOUND!");
        checkWord(word.toUpperCase());
        checkRound(word);
      } else {
        console.log("NOT FOUND!");
        toast("Not in word list");
      }
    }
  };

  const checkWord = (word: string) => {
    let found = foundLetters;
    let correct: string[] = correctLetters;
    let wrong = wrongLetters;

    for (let i = 0; i < word.length; i++) {
      const letter = word[i];

      if (correctWord.includes(letter)) {
        found.push(letter);
        if (correctWord[i] === letter) {
          correct.push(letter);
          console.log("Found.");
        }
      } else {
        wrong.push(letter);
      }

      setCorrectLetters(correct);
      setWrongLetters(wrong);
      setFoundLetters(found);
    }
  };

  const checkRound = (word: string) => {
    if (word.toLowerCase() === correctWord.toLowerCase()) {
      console.log("WINNER!");
      toast(congratsText[row]);
      setRow(row + 1);
      setGameOver(true);
    } else {
      if (row < 5) {
        setRow(row + 1);
      } else {
        setRow(row + 1);
        setGameOver(true);
        toast("Next time");
      }
    }
  };

  return (
    <>
      <div>
        <Header />
        <Toaster>
          {(t) => (
            <div className="bg-gray-900 text-white px-4 py-2 rounded-sm text-sm">
              {resolveValue(t.message, t)}
            </div>
          )}
        </Toaster>
        <div className="flex items-center justify-center w-full mt-6">
          <div className="space-y-1.5">
            <WordRow
              index={0}
              row={row}
              correctWord={correctWord}
              selectedLetters={selectedLetters.slice(0, 5)}
            />
            <WordRow
              index={1}
              row={row}
              correctWord={correctWord}
              selectedLetters={selectedLetters.slice(5, 10)}
            />
            <WordRow
              index={2}
              row={row}
              correctWord={correctWord}
              selectedLetters={selectedLetters.slice(10, 15)}
            />
            <WordRow
              index={3}
              row={row}
              correctWord={correctWord}
              selectedLetters={selectedLetters.slice(15, 20)}
            />
            <WordRow
              index={4}
              row={row}
              correctWord={correctWord}
              selectedLetters={selectedLetters.slice(20, 25)}
            />
            <WordRow
              index={5}
              row={row}
              correctWord={correctWord}
              selectedLetters={selectedLetters.slice(25, 30)}
            />
          </div>
        </div>
        <div className="flex items-center justify-center w-full mt-4">
          <Keyboard
            row={row}
            handleLetterClick={handleLetterClick}
            handleBack={handleBack}
            handleEnter={handleEnter}
            correctWord={correctWord}
            selectedLetters={selectedLetters}
            correctLetters={correctLetters}
            foundLetters={foundLetters}
            wrongLetters={wrongLetters}
          />
        </div>
      </div>
    </>
  );
}

export default App;
