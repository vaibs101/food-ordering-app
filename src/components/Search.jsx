import { useContext, useEffect, useState } from "react";
import Dishes from "./Dishes";
import SearchRestaurant, { withHoc } from "./SearchRestaurant";
import { Coordinates } from "../context/contextApi";
import { useDispatch, useSelector } from "react-redux";
import { resetSimilarResDish } from "../utils/toggleSlice";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dishes, setDishes] = useState([]);
  const [restaurantData, setRestaurantData] = useState([]);
  const [selectedResDish, setSelectedResDish] = useState(null);
  const [similarResDishes, setSimilarResDishes] = useState([]);

  const {
    coord: { lat, lng },
  } = useContext(Coordinates);

  const PromotedRes = withHoc(SearchRestaurant);

  const { isSimilarResDishes, city, resId, itemId, resLocation } = useSelector(
    (state) => state.toggleSlice.similarResDish
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchQuery === "") {
      return;
    }
    fetchDishes();
    fetchRestaurantData();
  }, [searchQuery]);

  useEffect(() => {
    fetchSimilarResDishes();
  }, [isSimilarResDishes]);

  async function fetchSimilarResDishes() {
    let pathname = `/city/${city}/${resLocation}`;
    let encodedPath = encodeURIComponent(pathname);

    const data = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=undefined&submitAction=ENTER&selectedPLTab=dish-add&restaurantMenuUrl=${encodedPath}-rest${resId}%3Fquery%3D${searchQuery}&restaurantIdOfAddedItem=${resId}&itemAdded=${itemId}`
    );
    let res = await data.json();
    setSelectedResDish(res?.data?.cards[1]);
    setSimilarResDishes(res?.data?.cards[1]?.card?.card?.cards);
    dispatch(resetSimilarResDish());
  }

  async function fetchDishes() {
    const data = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=null&submitAction=SUGGESTION&queryUniqueId=5a889e84-5331-81fa-3ca5-2ee3d8b52aae&metaData=%7B%22type%22%3A%22DISH%22%2C%22data%22%3A%7B%22vegIdentifier%22%3A%22NA%22%2C%22cloudinaryId%22%3A%22z5s9vrflt9bnyqwgvbo3%22%2C%22dishFamilyId%22%3A%22846647%22%2C%22dishFamilyIds%22%3A%5B%22846647%22%5D%7D%2C%22businessCategory%22%3A%22SWIGGY_FOOD%22%2C%22displayLabel%22%3A%22Dish%22%7D`
    );
    let res = await data.json();
    let finalData =
      res?.data?.cards[1]?.groupedCard?.cardGroupMap?.DISH?.cards?.filter(
        (data) => data?.card?.card?.info
      );
    setDishes(finalData);
  }

  async function fetchRestaurantData() {
    const data = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=null&submitAction=SUGGESTION&queryUniqueId=5a889e84-5331-81fa-3ca5-2ee3d8b52aae&metaData=%7B%22type%22%3A%22DISH%22%2C%22data%22%3A%7B%22vegIdentifier%22%3A%22NA%22%2C%22cloudinaryId%22%3A%22z5s9vrflt9bnyqwgvbo3%22%2C%22dishFamilyId%22%3A%22846647%22%2C%22dishFamilyIds%22%3A%5B%22846647%22%5D%7D%2C%22businessCategory%22%3A%22SWIGGY_FOOD%22%2C%22displayLabel%22%3A%22Dish%22%7D&selectedPLTab=RESTAURANT`
    );
    let res = await data.json();
    const finalData =
      res?.data?.cards[0]?.groupedCard?.cardGroupMap?.RESTAURANT?.cards?.filter(
        (data) => data?.card?.card?.info
      );
    setRestaurantData(finalData);
  }

  const filterOptions = ["Restaurant", "Dishes"];

  const [activeBtn, setActiveBtn] = useState("Dishes");

  function handleFilterBtn(filterName) {
    setActiveBtn(activeBtn === filterName ? activeBtn : filterName);
  }

  function handleSearchQuery(e) {
    let val = e.target.value;
    if (e.keyCode === 13) {
      setSearchQuery(val);
      setSelectedResDish(null);
      setDishes([]);
    }
  }
  return (
    <div className="w-full mt-10 md:w-[800px] mx-auto">
      <div className="w-full relative">
        <i className="fi fi-rr-angle-small-left text-2xl mt-1 ml-2 absolute top-1/2 -translate-y-1/2"></i>
        <i className="fi fi-rr-search absolute top-1/2 -translate-y-1/2 mr-5 right-0"></i>

        <input
          onKeyDown={handleSearchQuery}
          className="w-full border-2 pl-8 py-3 text-xl focus:outline-none"
          type="text"
          placeholder="search for restaurant and food"
        ></input>
      </div>
      {!selectedResDish && (
        <div className="my-7 flex flex-wrap gap-3">
          {filterOptions?.map((filterName, i) => (
            <button
              key={i}
              className={
                "filterBtn flex gap-2 " +
                (activeBtn === filterName ? "active" : "")
              }
              onClick={() => handleFilterBtn(filterName)}
            >
              <p>{filterName}</p>
            </button>
          ))}
        </div>
      )}

      <div className="w-full md:w-[800px] mt-5  grid grid-cols-1 md:grid-cols-2 bg-[#f4f5f7]">
        {selectedResDish ? (
          <>
            <div>
              <p className="p-4">Item added to cart</p>
              <Dishes data={selectedResDish?.card?.card} />
              <p className="p-4">More dishes from this restaurant</p>
            </div>
            <br />

            {similarResDishes?.map((data, i) => (
              <Dishes
                key={i}
                data={{
                  ...data?.card,
                  restaurant: selectedResDish?.card?.card?.restaurant,
                }}
              />
            ))}
          </>
        ) : activeBtn === "Dishes" ? (
          dishes?.map((data, i) => <Dishes key={i} data={data?.card?.card} />)
        ) : (
          restaurantData?.map((data, i) =>
            data?.card?.card?.info?.promoted ? (
              <PromotedRes key={i} data={data} />
            ) : (
              <SearchRestaurant key={i} data={data} />
            )
          )
        )}
      </div>
    </div>
  );
};

export default Search;
