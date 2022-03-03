import { useState } from "react";

export default function useVisualMode(initialState) {
  const[history, setHistory] = useState([initialState]);

  const transition = function(newMode, replace = false) {
    const newHistory = [...history];
    if (replace) newHistory.pop();
    newHistory.push(newMode);
    setHistory(newHistory);
  }

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