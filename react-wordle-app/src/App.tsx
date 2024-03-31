import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Keyboard from "./components/Keyboard";
import WordRow from "./components/WordRow";
import { WordleWord } from "../typings.ts";
import { useEffect } from "react";
import toast, { Toaster, resolveValue } from "react-hot-toast";
import "@fontsource/roboto/500.css";
import { motion, useAnimation } from "framer-motion";

// https://wordle-api.cyclic.app/words WORDLE API

function App() {
  const [row, setRow] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [data, setData] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [correctWord, setCorrectWord] = useState<string>("Space");
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [foundLetters, setFoundLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const animationControls = Array.from({ length: 6 }, () => useAnimation());

  const congratsText = [
    "Genius",
    "Magnificent",
    "Impressive",
    "Splendid",
    "Great",
    "Phew",
  ];

  useEffect(() => {
    fetchDictionary();
    fetchCorrectWordAPI();
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

  const fetchDictionary = async () => {
    try {
      const response = await fetch(`/src/assets/dictionary.json`);

      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse response data
      const responseData = await response.json();

      // Set fetched data to state
      console.log(responseData);
      setData(responseData);
    } catch (error) {
      // Handle errors
      console.log(error);
    }
  };

  const fetchCorrectWordAPI = async () => {
    try {
      const response = await fetch("https://wordle-api.cyclic.app/words", {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse response data
      const responseData = (await response.json()) as WordleWord[];

      const currentDate: Date = new Date();
      const currentDayOfYear: number =
        Math.floor(
          (currentDate.getTime() -
            new Date(currentDate.getFullYear(), 0, 0).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1; // Adding 1 because the first day of the year is 1, not 0

      setCorrectWord(responseData[currentDayOfYear].word.toUpperCase());
      setIsLoading(false);
      console.log(responseData[currentDayOfYear]);
    } catch (e) {
      console.log(e);
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
    if (row > 5 || gameOver || isLoading) {
      console.log(data);
      return;
    }

    if (data !== null) {
      const letters = selectedLetters.slice(row * 5, (row + 1) * 5);
      const word = letters.join("").toLowerCase();

      if (word.length < 5) {
        toast.remove();
        toast("Not enough letters");
        shakeRow();
        return;
      }

      console.log(word);

      if (data.some((e) => e === word)) {
        console.log("FOUND!");
        checkWord(word.toUpperCase());
        checkRound(word);
      } else {
        console.log("NOT FOUND!");
        toast.remove();
        toast("Not in word list");
        shakeRow();
      }
    }
  };

  const shakeRow = async () => {
    await animationControls[row].start({
      x: [-2, 2, -2, 2, -2, 0],
      transition: {
        duration: 0.5,
        ease: "linear",
      },
    });
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
      toast.remove();
      toast(congratsText[row]);
      setRow(row + 1);
      setGameOver(true);
    } else {
      if (row < 5) {
        setRow(row + 1);
      } else {
        setRow(row + 1);
        setGameOver(true);
        toast.remove();
        toast(correctWord, { duration: Infinity });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#121212] dark:text-white/90 text-black">
        <Header />
        <Toaster position="top-center">
          {(t) => (
            <motion.div
              initial={{ scale: 0.9, opacity: 0.95, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              // transition={{ duration: 0.1 }}
              className="absolute top-8 shadow-md bg-zinc-900 dark:bg-white dark:text-black/90 text-white px-4 py-2 rounded-sm text-sm"
            >
              {resolveValue(t.message, t)}
            </motion.div>
          )}
        </Toaster>
        <div className="  flex items-center justify-center w-full mt-6">
          <div className="space-y-1.5">
            <motion.div animate={animationControls[0]}>
              <WordRow
                index={0}
                row={row}
                correctWord={correctWord}
                selectedLetters={selectedLetters.slice(0, 5)}
              />
            </motion.div>
            <motion.div animate={animationControls[1]}>
              <WordRow
                index={1}
                row={row}
                correctWord={correctWord}
                selectedLetters={selectedLetters.slice(5, 10)}
              />
            </motion.div>
            <motion.div animate={animationControls[2]}>
              <WordRow
                index={2}
                row={row}
                correctWord={correctWord}
                selectedLetters={selectedLetters.slice(10, 15)}
              />
            </motion.div>
            <motion.div animate={animationControls[3]}>
              <WordRow
                index={3}
                row={row}
                correctWord={correctWord}
                selectedLetters={selectedLetters.slice(15, 20)}
              />
            </motion.div>
            <motion.div animate={animationControls[4]}>
              <WordRow
                index={4}
                row={row}
                correctWord={correctWord}
                selectedLetters={selectedLetters.slice(20, 25)}
              />
            </motion.div>
            <motion.div animate={animationControls[5]}>
              <WordRow
                index={5}
                row={row}
                correctWord={correctWord}
                selectedLetters={selectedLetters.slice(25, 30)}
              />
            </motion.div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full mt-4">
          <Keyboard
            row={row}
            handleLetterClick={handleLetterClick}
            handleBack={handleBack}
            handleEnter={handleEnter}
            correctWord={correctWord}
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
