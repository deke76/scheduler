import { useState } from "react";

export default function useVisualMode(initialState) {
  const[mode, setMode] = useState(initialState);
  const[history, setHistory] = useState([initialState]);

  const transition = function(newMode, replace = false) {
    const newHistory = [...history];
    if (replace) newHistory.pop();
    newHistory.push(newMode);
    setMode(newMode);
    setHistory(newHistory);
  }

  const back = function() {
    const newHistory = [...history];
    if (history.length > 1) {
      newHistory.pop();
      setMode(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    } 
  }

  return { mode, transition, back, history }
}