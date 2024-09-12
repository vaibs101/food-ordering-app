import { useState } from "react";
import RestaurantCard from "./RestaurantCard";

const TopRestaurant = ({ data = [], title }) => {
  const [value, setValue] = useState(0);

  const handleNext = () => {
    value >= 130 ? "" : setValue((prev) => prev + 50);
  };

  const handlePrev = () => {
    value <= 0 ? "" : setValue((prev) => prev - 50);
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between mt-2">
        <h1 className="font-bold text-2xl">{title}</h1>
        <div className="flex gap-3">
          <div
            onClick={handlePrev}
            className={
              `cursor-pointer rounded-full w-9 h-9 flex justify-center` +
              (value <= 0 ? "bg-gray-100" : "bg-gray-200")
            }
          >
            <i
              className={
                `fi text-2xl mt-1 fi-rr-arrow-small-left ` +
                (value <= 0 ? "text-gray-300" : "text-gray-800")
              }
            ></i>
          </div>
          <div
            onClick={handleNext}
            className={
              `cursor-pointer rounded-full w-9 h-9 flex justify-center` +
              (value >= 130 ? "bg-gray-100" : "bg-gray-200")
            }
          >
            <i
              className={
                `fi text-2xl mt-1 fi-rr-arrow-small-right ` +
                (value >= 130 ? "text-gray-300" : "text-gray-800")
              }
            ></i>
          </div>
        </div>
      </div>
      <div
        className={"flex mt-4 gap-5 w-full duration-300"}
        style={{ translate: `-${value}%` }}
      >
        {data?.map(({ info, cta: { link } }) => (
          <div className="hover:scale-95 duration-300" key={info?.id}>
            <RestaurantCard info={info} link={link} />
          </div>
        ))}
      </div>
      <hr className="border mt-10" />
    </div>
  );
};

export default TopRestaurant;
