import { useState } from "react";

const OnYourMind = ({ data }) => {
  const [value, setValue] = useState(0);

  const handleNext = () => {
    value >= 130 ? "" : setValue((prev) => prev + 31);
  };

  const handlePrev = () => {
    value <= 0 ? "" : setValue((prev) => prev - 31);
  };

  return (
    <div>
      <div className="flex justify-between mt-2">
        <h1 className="font-bold text-2xl">What's on your mind?</h1>
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
        style={{ translate: `-${value}%` }}
        className={`flex mt-4 duration-300`}
      >
        {data?.map((item) => (
          <img
            key={item.id}
            className="w-40"
            src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/${item.imageId}`}
            alt=""
          ></img>
        ))}
      </div>
      <hr className="border" />
    </div>
  );
};

export default OnYourMind;
