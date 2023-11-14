import {useCallback, useEffect, useState} from 'react';
import words from "./wordlist.json" 
import {HangmanDrawing} from "./Components/HangmanDrawing";
import {HangmanWord} from "./Components/HangmanWord";
import {HangmanKeyboard} from "./Components/HangmanKeyboard";

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });
  const [guessedLetters, setGuessedLetter]=useState<string[]>([])
  const incorrectLetter=guessedLetters.filter(
    letter=>!wordToGuess.includes(letter)
  )

  const isLoser=incorrectLetter.length>=6;
  const isWinner=wordToGuess.split("").every(letter=>guessedLetters.includes(letter))
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (isWinner || isLoser || guessedLetters.includes(letter)) return;
      setGuessedLetter(currentLetters => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };
  
    document.addEventListener("keypress", handler);
  
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);
  
  return (
    <div style={{
      maxWidth:"800px",
      display:"flex" ,
      flexDirection:"column",
      gap:"2rem",
      margin:"0 auto",
      alignItems:"center"
    }}>
      <div style={{fontSize:"2rem", textAlign:"center"}}>
        { isWinner &&"Winner: Refresh to play again"}
        { isLoser && "Lose: Try again by refreshing the page"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetter.length}/>
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess}/>
      <div style={{alignSelf:"stretch"}}>
      <HangmanKeyboard disabled={isLoser || isWinner} activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))} inactiveLetters={incorrectLetter} addGuessedLetter={addGuessedLetter}/>
      </div>
    </div>
  )
}

export default App
