import { Route, Routes } from "react-router-dom";
import "./App.css";
import Body from "./components/Body";
import Head from "./components/Head";
import RestaurantMenu from "./components/RestaurantMenu";
import { Coordinates } from "./context/contextApi";
import { useState } from "react";
import Cart from "./components/Cart";
import { useSelector } from "react-redux";
import Search from "./components/Search";

function App() {
  const [coord, setCoord] = useState({ lat: 26.8756, lng: 80.9115 });

  const visible = useSelector((state) => state.toggleSlice.searchBarToggle);
  const loginVisible = useSelector((state) => state.toggleSlice.loginToggle);
  const cartData = useSelector((state) => state.cartSlice.cartItems);
  return (
    <Coordinates.Provider value={{ coord, setCoord }}>
      <div
        className={
          "overflow-x-hidden " +
          (visible || loginVisible ? "max-h-screen overflow-hidden" : "")
        }
      >
        <Routes>
          <Route path="/" element={<Head />}>
            <Route path="/" element={<Body />}></Route>
            <Route
              path="/restaurantMenu/:id"
              element={<RestaurantMenu />}
            ></Route>
            <Route path="/cart" element={<Cart />}></Route>
            <Route path="/search" element={<Search />}></Route>

            <Route path="*" element={<h1>Coming Soon.......</h1>}></Route>
          </Route>
        </Routes>
      </div>
    </Coordinates.Provider>
  );
}

export default App;
