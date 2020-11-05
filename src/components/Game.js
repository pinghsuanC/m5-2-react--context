import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import cookieSrc from "../cookie.svg";
import Item from "./Item.js";
import useInterval from "../hooks/use-interval.hook";
import useDocumentTitle from "../hooks/use-documentTitle";
import useKeyDown from "../hooks/use-keydown";
import usePersistedState from "../hooks/use-PersistedState";
import SmallCookie from "./SmallCookie";
import HandCursor from "./HandCursor";
import cursorSrc from "../cursorHand.png";
import { GameContext } from "./GameContext";

let x = 5; // the base exp

const Game = () => {
  //localStorage.clear();
  const {
    refImg,
    perClick,
    setPerClick,
    perSec,
    setPerSec,
    wCookie,
    setWC,
    numCookies,
    setNumC,
    lastT,
    setLastT,
    purchasedItems,
    items,
    setPurchasedI,
    numOfGeneratedCookies,
    backgroundCookieN,
    backgroundCookieArray,
    cursorHandN,
    cursorHandArray,
    initialCookie,
    initialClick,
    initialPurchase,
  } = useContext(GameContext);

  // update the cookies while you are away

  // ========================= hooks =========================
  useInterval(() => {
    // Add this number of cookies to the total
    setNumC(numCookies + numOfGeneratedCookies);
    setPerSec(numOfGeneratedCookies);
    setLastT(Math.floor(Date.now() / 1000));
  }, 1000);

  // change title
  useDocumentTitle("", `${numCookies}`);
  // handle clicking
  const handleCookieClick = () => {
    // update parameters
    setPerSec(perSec + perClick);
    setNumC(numCookies + perClick);
  };
  useKeyDown(handleCookieClick, "Space");

  // ========================= handlers ====================
  const handleClick = (cat, cost, value) => {
    // cat: cursor/grandma/farm (id of items)
    cat = cat.toLowerCase();
    // check affordable or not
    if (numCookies >= cost) {
      // update numcookie by deducting cost
      setNumC(numCookies - cost);
      // update num purchased
      //    can't really use [cat]:newVal, so create a new one
      let newP = { ...purchasedItems };
      newP[cat].num++;
      setPurchasedI(newP); // or the spread operator also works find

      // deal with the price
      items.forEach((element) => {
        if (element.id === cat) {
          element.cost = Math.floor(Math.log(element.cost) * x + element.cost);
          x = x * 1.1; // increase x
        }
      });

      // deal with the click setup
      if (newP[cat].type === "click") {
        setPerClick(perClick + value);
      }
    } else {
      // inform not enough cookies
      window.alert(`You don't have enough cookies for a ${cat}.`);
    }
  };
  const handleRestart = () => {
    localStorage.clear();
    setNumC(initialCookie);
    setPurchasedI(initialPurchase);
    setPerClick(initialClick);
  };

  return (
    <Wrapper>
      {backgroundCookieArray.map((ele, ind) => {
        return (
          <SmallCookie key={`bkgCookie-${ind}`} imgSrc={cookieSrc} ind={ind} />
        );
      })}
      <ClearGameBtn onClick={handleRestart}>Restart</ClearGameBtn>
      <GameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          {/* TODO: Calcuate the cookies per second and show it here: */}
          <strong>
            {/*It wasn't specified, so calculate for each second seperately 
              i.e. if you clicked the cookie for this second, it won't be counted towards the next one
              */}
            {perSec}
          </strong>{" "}
          cookies per second
        </Indicator>
        <Button onClick={handleCookieClick}>
          {cursorHandArray.map((ele, ind) => {
            return (
              <HandCursor
                cursorSrc={cursorSrc}
                ind={ind}
                cen={() => {
                  return [refImg.styled.x, refImg.styled.y];
                }}
                key={`cursorHand-${ind}`}
              />
            );
          })}
          <Cookie
            src={cookieSrc}
            onMouseUp={() => {
              setWC(400);
            }}
            onMouseDown={() => {
              setWC(wCookie * 0.9);
            }}
            id="cookie-img"
            ref={refImg}
            w={wCookie}
          />
        </Button>
      </GameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {/* TODO: Add <Item> instances here, 1 for each item type. */}
        <ItemAlign>
          {items.map((ele, ind) => {
            return (
              <Item
                key={ele.id}
                first={ind === 0}
                id={ele.id}
                name={ele.name}
                numCost={ele.cost}
                numProduces={ele.value}
                numOwned={purchasedItems[ele.id].num}
                type={purchasedItems[ele.id].type}
                handleClick={handleClick}
              />
            );
          })}
        </ItemAlign>
      </ItemArea>
      <HomeLink to="/">Return home </HomeLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;
const GameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;
const Button = styled.button`
  position: relative;
  border: none;
  background: transparent;
  cursor: pointer;
  :focus {
    outline: none;
  }
`;

const Cookie = styled.img`
  width: ${(prop) => `${prop.w}px`};
`;

const ItemAlign = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ClearGameBtn = styled.button`
  position: absolute;
  left: 110px;
  top: 15px;
  width: 120px;
  border-radius: 10px;
  margin-left: 10px;
  :hover {
    cursor: pointer;
  }
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;

const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #666;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default Game;
