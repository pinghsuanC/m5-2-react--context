import React, { useEffect, useState } from "react";

function usePersistedState(iniVal, item_key) {
  const [numCookies, setNumC] = useState(() => {
    const curItem = localStorage.getItem(item_key);
    if (curItem) {
      return JSON.parse(curItem);
    } else {
      return iniVal;
    }
  });
  // global event listener
  useEffect(() => {
    // store to local storage
    localStorage.setItem(item_key, JSON.stringify(numCookies));
    // localStorage.setItem(item_key, item_amount);
  }, [numCookies, item_key]);

  return [numCookies, setNumC];
}
export default usePersistedState;
