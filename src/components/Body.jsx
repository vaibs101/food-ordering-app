import OnYourMind from "./onYourMind";
import TopRestaurant from "./TopRestaurant";
import OnlineFoodDelivery from "./OnlineFoodDelivery";
import { useSelector } from "react-redux";
import Shimmer from "./Shimmer";
import useRestaurantsData from "../hooks/useRestaurantsData";

const Body = () => {
  const [topRestaurantdata, topResTitle, onlineResTitle, onYourMindData, data] =
    useRestaurantsData();

  const filterVal = useSelector((state) => state.filterSlice.filterVal);
  const filteredData = topRestaurantdata.filter((item) => {
    if (!filterVal) return true;
    switch (filterVal) {
      case "Ratings 4.0+":
        return item?.info?.avgRating > 4;
      case "Rs. 300-Rs. 600":
        return (
          item?.info?.costForTwo?.slice(1, 4) >= "300" &&
          item?.info?.costForTwo?.slice(1, 4) <= "600"
        );
      case "Offers":
        return;
      case "Less than Rs. 300":
        return item?.info?.costForTwo?.slice(1, 4) < 300;
      default:
        return true;
    }
  });

  if (data?.communication) {
    return (
      <div className="flex mt-64 justify-center items-center flex-col">
        <img
          className="w-72"
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_476,h_476/portal/m/location_unserviceable.png"
        ></img>
        <h1 className="font-bold">Location Unserviceable</h1>
      </div>
    );
  }

  return (
    <div className="w-full ">
      {topRestaurantdata.length ? (
        <div className="w-full px-10 sm:w-[90%] lg:w-[80%] mx-auto mt-1 overflow-hidden">
          {onYourMindData.length ? (
            <>
              <OnYourMind data={onYourMindData} />
              <TopRestaurant data={topRestaurantdata} title={topResTitle} />
            </>
          ) : (
            ""
          )}
          <OnlineFoodDelivery
            data={filterVal ? filteredData : topRestaurantdata}
            title={onlineResTitle}
          />
        </div>
      ) : (
        <Shimmer />
      )}
    </div>
  );
};

export default Body;
