import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Keyboard from "./components/Keyboard";
import WordRow from "./components/WordRow";
import { WordleWord } from "../typings.ts";
import { useEffect } from "react";

// https://wordle-api.cyclic.app/words WORDLE API

function App() {
  const [row, setRow] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [data, setData] = useState<WordleWord[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [correctWord, setCorrectWord] = useState<string>("Space");

  useEffect(() => {
    fetchData();
  }, []);

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
    if (selectedLetters.length < (row + 1) * 5) {
      setSelectedLetters([...selectedLetters, letter]);
    }

    console.log(letter);
    console.log(selectedLetters);
  };

  const handleBack = () => {
    if ((row + 0) * 5 < selectedLetters.length) {
      setSelectedLetters((prevSelectedLetters) =>
        prevSelectedLetters.slice(0, -1)
      );
    }
  };

  const handleEnter = () => {
    if (data !== null) {
      const letters = selectedLetters.slice(row * 5, (row + 1) * 5);
      const word = letters.join("").toLowerCase();

      console.log(word);

      if (data.some((e) => e.word === word)) {
        console.log("FOUND!");
        setRow(row + 1);
      } else {
        console.log("NOT FOUND!");
      }
    }
  };

  return (
    <>
      <div>
        <Header />
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
          />
        </div>
      </div>
    </>
  );
}

export default App;
