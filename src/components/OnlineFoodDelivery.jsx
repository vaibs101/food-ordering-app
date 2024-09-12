import { useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { useDispatch } from "react-redux";
import { setFilterValue } from "../utils/filterSlice";

const OnlineFoodDelivery = ({ data, title }) => {
  const filterOptions = [
    "Fast Delivery",
    "New on Swiggy",
    "Ratings 4.0+",
    "Rs. 300-Rs. 600",
    "Offers",
  ];

  const [activeBtn, setActiveBtn] = useState(null);
  const dispatch = useDispatch();

  function handleFilterBtn(filterName) {
    setActiveBtn(activeBtn === filterName ? null : filterName);
  }
  dispatch(setFilterValue(activeBtn));

  return (
    <div>
      <h1 className="font-bold my-7 text-2xl">{title}</h1>
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
            <i className="fi text-sm mt-1 fi-br-cross hidden"></i>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-col-4 gap-10">
        {data?.map(({ info, cta: { link } }) => (
          <div className="hover:scale-95 duration-300" key={info?.id}>
            <RestaurantCard info={info} link={link} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineFoodDelivery;
