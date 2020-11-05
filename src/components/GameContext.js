import React, { useState, useRef } from "react";
import usePersistedState from "../hooks/use-PersistedState";

const GameContext = React.createContext(null);

const GameProvider = ({ children }) => {
  // I would make items a large {} so that it's easier and less messier....
  // constants
  const initialCookie = 1000;
  let initialClick = 1;
  const initialPurchase = {
    cursor: { num: 0, type: "tick" },
    grandma: { num: 0, type: "tick" },
    farm: { num: 0, type: "tick" },
    megacursor: { num: 0, type: "click" },
  };
  const items = [
    { id: "cursor", name: "Cursor", cost: 10, value: 1, type: "tick" },
    { id: "grandma", name: "Grandma", cost: 100, value: 10, type: "tick" },
    { id: "farm", name: "Farm", cost: 1000, value: 80, type: "tick" },
    {
      id: "megacursor",
      name: "Mega Cursor",
      cost: 500,
      value: 50,
      type: "click",
    },
  ];
  // used by the falling cookies
  const backgroundCookieN = 15; // number of cookies falling from the background
  const backgroundCookieArray = [];
  while (backgroundCookieArray.length < backgroundCookieN) {
    backgroundCookieArray.push(true);
  }
  // used by cursors
  const cursorHandN = 5; // number of cookies falling from the background
  const cursorHandArray = [];
  while (cursorHandArray.length < cursorHandN) {
    cursorHandArray.push(true);
  }

  // useState
  const refImg = useRef(null);
  const [perClick, setPerClick] = useState(initialClick);
  const [wCookie, setWC] = useState(400); // cookie width
  const [perSec, setPerSec] = useState(0);
  // persisted state
  const [numCookies, setNumC] = usePersistedState(initialCookie, "num_cooke");
  const [lastT, setLastT] = usePersistedState(0, "leave_T");
  const [purchasedItems, setPurchasedI] = usePersistedState(
    initialPurchase,
    "data_buy"
  );

  const calculateCookiesPerTick = (purchased) => {
    let r = 0;
    let ele;
    for (ele of items) {
      // check if it exists for safety
      if (purchased[ele.id] && purchased[ele.id].type === "tick") {
        // find the amount to add
        r += purchased[ele.id].num * ele.value;
      }
    }
    return r;
  };

  // find current time
  let cur_t = Math.floor(Date.now() / 1000);
  // find the time relapsed and cookie generated
  let numGenerated =
    calculateCookiesPerTick(purchasedItems) +
    (cur_t - lastT) * calculateCookiesPerTick(purchasedItems);

  return (
    <GameContext.Provider
      value={{
        refImg,
        perClick,
        setPerClick,
        perSec,
        setPerSec,
        wCookie,
        setWC,
        lastT,
        setLastT,
        numCookies,
        setNumC,
        purchasedItems,
        items,
        setPurchasedI,
        numOfGeneratedCookies: numGenerated,
        backgroundCookieN,
        backgroundCookieArray,
        cursorHandN,
        cursorHandArray,
        initialCookie,
        initialClick,
        initialPurchase,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameProvider, GameContext };
