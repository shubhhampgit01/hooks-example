import React, { useCallback, useEffect, useMemo, useState } from "react";

import "./App.css";
import Lists from "./component/list";

function App() {
  const [items, setItems] = useState([]);

  const [number, setNumber] = useState(0);

  // with callback

  // const addItem = useCallback(() => {
  //   setItems([...items, "item added"]);
  // }, [items]);

  // without callback

  const addItem = () => {
    setItems([...items, "item added"]);
  };

  // this way we can also prevent the rerender of api calls while using like this in useCallback
  // and calling only when certain variable changes as th function addItems gets a new reference every time
  const callApi = useCallback(async () => {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      console.log("api called");
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  }, [addItem]);

  useEffect(() => {
    callApi();
  }, [callApi]);

  // const callApi = async () => {
  //   try {
  //     const res = await fetch("https://fakestoreapi.com/products");
  //     const data = await res.json();
  //     console.log("api called");
  //   } catch (error) {
  //     console.error("Error fetching API:", error);
  //   }
  // };

  // useEffect(() => {
  //   callApi();
  // }, [addItem]);

  const increment = () => {
    setNumber(number + 1);
  };

  // with useMemo
  // const isEven = useMemo(() => {
  //   let i = 0;
  //   while (i < 2000000000) i++;
  //   return number % 2 == 0;
  // }, [number]);

  // without useMemo
  const isEven = () => {
    let i = 0;
    while (i < 2000000000) i++;
    return number % 2 == 0;
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{isEven() ? "even" : "odd"}</p>
        <p>{number}</p>
        <button onClick={increment}>increase number</button>

        <Lists items={items} addItem={addItem} />
      </header>
    </div>
  );
}

export default App;
