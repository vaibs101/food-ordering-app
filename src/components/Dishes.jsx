import { useDispatch, useSelector } from "react-redux";
import { nonveg, veg } from "../utils/constant";
import { setSimilarResDish, toggleDiffRes } from "../utils/toggleSlice";
import AddToCartBtn from "./AddToCartBtn";
import { clearCart } from "../utils/cartSlice";
import { Link } from "react-router-dom";

const Dishes = ({
  data: {
    
        info,
        restaurant: { info: resInfo },
        hideRestaurantDetails= false
      },
   
}) => {
  let { imageId = "", name, price, isVeg = 0, id: itemId } = info;
  let {
    id,
    name: resName,
    avgRating,
    sla: { slaString },
    slugs:{
      city,
      restaurant: resLocation,
    }
  } = resInfo;

  const dispatch = useDispatch();
  const isDiffRes=useSelector((state)=>state.toggleSlice.isDiffRes);
  const {id:cartResId} = useSelector(state => state.cartSlice.resInfo);
    

   const handleIsDiffRes = () => {
dispatch(toggleDiffRes())
   }

   const handleClearCart = () => {
    dispatch(clearCart());
    handleIsDiffRes();
}

const handleSameRes = () => {
  if(cartResId===id || !cartResId)
{  //dispatch(toggleIsSimilarResDishes());
  dispatch(setSimilarResDish({
    isSimilarResDishes: true,
    city,
    resLocation,
    resId: id,
    itemId,
  }))
}

}
  return (
    <>
    
    <div className="m-4 bg-white rounded-2xl p-4">
      {
        !hideRestaurantDetails && 
        <>
        <Link to={`/restaurantMenu/${resLocation}-${id}`}>
        <div className="flex justify-between text-sm opacity-50">
        <div>
          <p className="font-bold">By {resName}</p>
          <p className="my-2">
            <i className="fi fi-ss-star"></i>
            {avgRating} . {slaString}
          </p>
        </div>
        <i className="fi fi-rr-arrow-small-right text-xl"></i>
      </div>
      </Link>
      <hr className="border-dotted" />
      
      </>
      }
      
      <div className="my-3 md:max-w-fit flex justify-between">
        <div className="w-[50%] md:w-[168px] flex flex-col gap-1">
          <div className="w-5 h-5">
            {isVeg ? (
              <img src={veg} alt=""></img>
            ) : (
              <img src={nonveg} alt=""></img>
            )}
          </div>
          <p className="text-lg font-semibold">{name}</p>
          <p className=""><i className="fi fi-bs-indian-rupee-sign text-sm pt-1 inline-block"></i>{price/100}</p>
        <button className="px-4 py-1 w-max rounded-3xl border">More Details</button>
        </div>
        <div className="w-[40%] md:w-[40%] relative h-full">
          <img
            className="rounded-xl object-cover aspect-square"
            src={
              "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/" +
              imageId
            }
            alt=""
          ></img>
          <div onClick={handleSameRes}>
          <AddToCartBtn
            info={info}
            resInfo={resInfo}
            handleIsDiffRes={handleIsDiffRes}
          />
          </div>
        </div>
      </div>
    </div>
    {
                isDiffRes && (
                    <div className='w-[520px] h-[200px] flex flex-col gap-2 z-50 left-[33%] p-8 border fixed bottom-10 bg-white'>
                        <h1>Items already in cart</h1>
                        <p>Your cart contains items from another restaurant. Would you like to reset your cart to add items from this restaurant?</p>
                        <div className='flex justify-between gap-3 w-full uppercase'>
                            <button onClick={handleIsDiffRes} className='border-2 w-1/2 border-green-700 text-green-700 p-3'>No</button>
                            <button onClick={handleClearCart} className='w-1/2 p-3 bg-green-700 text-white'>Yes, Start Afresh</button>
                        </div>
                    </div>
                )
            }
    </>
  );
};

export default Dishes;
