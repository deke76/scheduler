import { useState } from "react";

export default function useVisualMode(initialState) {
  const[history, setHistory] = useState([initialState]);

  // transition forward, replace the current state if the replace flag is true
  const transition = function(newMode, replace = false) {
    const newHistory = [...history];
    if (replace) newHistory.pop();
    newHistory.push(newMode);
    setHistory(newHistory);
  }

  // move the screen back, used in situations where user cancels (delete/edit)
  const back = function() {
    const newHistory = [...history];
    if (history.length > 1) {
      newHistory.pop();
      setHistory(newHistory);
    } 
  }
  const mode = history.slice(-1)[0];
  return { mode, transition, back }
}