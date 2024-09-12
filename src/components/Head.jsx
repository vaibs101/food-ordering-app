import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Coordinates } from "../context/contextApi";
import { useDispatch, useSelector } from "react-redux";
import { toggleLogin, toggleSearchBar } from "../utils/toggleSlice";
import SignInBtn from "./SignInBtn";

const Head = () => {
  const navItems = [
    { name: "Search", image: "fi-rr-search", path: "/search" },
    { name: "Sign In", image: "fi-rr-user", path: "/signIn" },
    { name: "Cart", image: "fi-rr-shopping-cart-add", path: "/cart" },
  ];

  const cartData = useSelector((state) => state.cartSlice.cartItems);
  const userData = useSelector((state) => state.authSlice.userData);
  const visible = useSelector((state) => state.toggleSlice.searchBarToggle);
  const loginVisible = useSelector((state) => state.toggleSlice.loginToggle);

  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState([]);
  const [address, setAddress] = useState("");

  const { setCoord } = useContext(Coordinates);

  function handleVisibility() {
    dispatch(toggleSearchBar());
  }

  function handleLogIn() {
    dispatch(toggleLogin());
  }

  async function searchResultFun(val) {
    if (val === "") return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/misc/place-autocomplete?input=${val}`
      );
      const json = await res.json();
      setSearchResult(json?.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  async function fetchLatAndLng(id) {
    if (id === "") return;
    handleVisibility();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/misc/address-recommend?place_id=${id}`
      );
      const json = await res.json();
      setCoord({
        lat: json.data[0]?.geometry?.location?.lat || 0,
        lng: json.data[0]?.geometry?.location?.lng || 0,
      });
      setAddress(json?.data[0]?.formatted_address || "");
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  }

  return (
    <>
      <div className="w-full">
        <div
          onClick={handleVisibility}
          className={`w-full h-full bg-black/50 absolute z-30 ${
            visible ? "visible" : "invisible"
          }`}
        ></div>
        <div
          className={`bg-white flex justify-end w-full md:w-[40%] p-5 h-full z-40 absolute duration-500 ${
            visible ? "left-0" : "-left-[100%]"
          }`}
        >
          <div className="flex flex-col gap-4 mt-3 w-full lg:w-[50%] mr-6">
            <i className="fi fi-br-cross" onClick={handleVisibility}></i>
            <input
              type="text"
              className="border p-5 focus:outline-none focus:shadow-lg"
              onChange={(e) => searchResultFun(e.target.value)}
            />
            <div className="border p-5">
              <ul>
                {searchResult.map((data, index) => {
                  //const isLast=index===searchResult.length-1;
                  <div key={index} className="my-5">
                    <div className="flex gap-4">
                      <i className="mt-1 fi fi-rr marker"></i>
                      <li onClick={() => fetchLatAndLng(data.place_id)}>
                        {data.structured_formatting.main_text}
                        <p className="text-sm opacity-65">
                          {data.structured_formatting.secondary_text}
                        </p>
                      </li>
                    </div>
                  </div>;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div
          onClick={handleLogIn}
          className={`w-full h-full bg-black/50 absolute z-30 ${
            loginVisible ? "visible" : "invisible"
          }`}
        ></div>
        <div
          className={`bg-white flex w-full md:w-[40%] p-5 h-full z-40 fixed duration-500 ${
            loginVisible ? "right-0" : "-right-[100%]"
          }`}
        >
          <div className="m-3 w-full lg:w-[60%]">
            <i className="fi fi-br-cross" onClick={handleLogIn}></i>
            <div className="my-10 w-full flex justify-between items-center">
              <h2 className="font-bold text-4xl border-b-2 border-black pb-5">
                Login
              </h2>
              <img
                className="w-28"
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/Image-login_btpq7r"
                alt="Login"
              />
            </div>
            <SignInBtn />
            <p className="text-base mt-2 opacity-70">
              By clicking on Login, I accept the Terms & Conditions & Privacy
              Policy
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <div className="w-full sticky bg-white z-20 top-0 shadow-md h-[80px] flex justify-center items-center">
          <div className="w-full sm:w-[90%] lg:w-[80%] flex justify-between">
            <div className="flex items-center">
              <Link to={"/"}>
                <div className="w-24">
                  <img
                    src="https://1000logos.net/wp-content/uploads/2021/05/Swiggy-emblem.png"
                    alt="logo"
                  />
                </div>
              </Link>
              <div
                className="flex items-center gap-2"
                onClick={handleVisibility}
              >
                <p className="flex items-center">
                  <span className="font-bold border-b-2 border-black">
                    Others
                  </span>
                  <span className="ml-2 max-w-[250px] text-sm opacity-85 line-clamp-1">
                    {address}
                  </span>
                </p>
                <i className="fi text-2xl mt-1 text-orange-400 fi-rs-angle-small-down"></i>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 md:gap-8">
              {navItems.map((data) =>
                data.name === "Sign In" ? (
                  <div key={data.path} onClick={handleLogIn}>
                    <div className="flex items-center gap-3">
                      {userData ? (
                        <div className="w-10 h-10 rounded-full">
                          <img src={userData.photo} alt="user" />
                        </div>
                      ) : (
                        <i
                          className={`mt-1 fi text-lg text-gray-700 ${data.image}`}
                        ></i>
                      )}
                      <p className="text-lg font-medium text-gray-700">
                        {userData?.name || data.name}
                      </p>
                      {data.name === "Cart" && <p>{cartData.length || 0}</p>}
                    </div>
                  </div>
                ) : (
                  <Link key={data.path} to={data.path}>
                    <div className="flex items-center gap-3">
                      <i
                        className={`mt-1 fi text-lg text-gray-700 ${data.image}`}
                      ></i>
                      <p className="text-lg font-medium text-gray-700">
                        {data.name}
                      </p>
                      {data.name === "Cart" && <p>{cartData.length || 0}</p>}
                    </div>
                  </Link>
                )
              )}
            </div>
            <div className="flex items-center md:hidden gap-10 mr-4">
              {navItems?.map((data) =>
                data.name === "Sign In" ? (
                  <div key={data.path} onClick={handleLogIn}>
                    <i
                      className={"mt-1 text-xl text-gray-700 " + data.image}
                    ></i>
                  </div>
                ) : (
                  <Link key={data.path} to={data?.path}>
                    <i
                      className={"mt-1 text-xl text-gray-700 " + data.image}
                    ></i>
                    {data.name === "Cart" && <span>{cartData?.length}</span>}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default Head;
