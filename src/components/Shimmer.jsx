const Shimmer = () => {
  return (
    <div className="w-full">
      <div className="w-full h-[300px] text-white flex justify-center items-center gap-5 flex-col bg-slate-900">
        <div className="relative">
          <img
            className="w-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 "
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/icecream_wwomsa"
          ></img>
          <span className="loader "></span>
        </div>
        <h1 className="text-2xl">Looking for great food near you....</h1>
      </div>
      <div className="w-[70%] mx-auto py-6 flex flex-wrap gap-5">
        {Array(21)
          .fill("")
          .map((data, i) => (
            <div
              key={i}
              className="w-[295px] h-[180px] animate rounded-md"
            ></div>
          ))}
      </div>
    </div>
  );
};

export default Shimmer;

export function MenuShimmer() {
  return (
    <div className="w-full lg:w-[50%] mx-auto mt-10">
      <div className="w-full h-40 sm:h-80 rounded-xl animate"> </div>
      <div className="w-full mt-10 flex justify-between">
        <div className="w-[45%] h-10 rounded-xl animate"></div>
        <div className="w-[45%] h-10 rounded-xl animate"></div>
      </div>
      <div className="w-full mt-20 flex flex-col gap-9">
        {Array(5)
          .fill("")
          .map((data, i) => (
            <div key={i} className="w-full h-40 flex justify-between">
              <div className="w-[60%] flex flex-col gap-5 h-full">
                <div className="w-[100%] h-5 animate"></div>
                <div className="w-[50%] h-5 animate"></div>
                <div className="w-[30%] h-5 animate"></div>
              </div>
              <div className="w-[30%] rounded-xl h-full animate"></div>
            </div>
          ))}
      </div>
    </div>
  );
}
