import React from 'react';
import { Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, deleteItem } from '../utils/cartSlice';
import toast from 'react-hot-toast';
import { toggleLogin } from '../utils/toggleSlice';

const Cart = () => {
  const vegSymbol = "https://www.pngkey.com/png/detail/261-2619381_chitr-veg-symbol-svg-veg-and-non-veg.png";
  const nonVegSymbol = "https://www.kindpng.com/picc/m/151-1515155_veg-icon-png-non-veg-symbol-png-transparent.png";

  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cartSlice.cartItems);
  const userData = useSelector((state) => state.authSlice.userData);
  const resInfo = useSelector((state) => state.cartSlice.resInfo);

  const totalPrice = cartData.reduce((acc, curVal) => (acc + (curVal.price || curVal.defaultPrice) / 100), 0);

  const handleRemoveFromCart = (index) => {
    if (cartData.length > 1) {
      const newArray = [...cartData];
      newArray.splice(index, 1);
      dispatch(deleteItem(newArray));
      toast.success("Item removed");
    } else {
      handleClearCart();
      toast.success("Cart is cleared");
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handlePlaceOrder = () => {
    if (!userData) {
      toast.error("Please login to place the order");
      dispatch(toggleLogin());
      return;
    }
    toast.success("Order Placed");
  };

  if (cartData.length === 0) {
    return (
      <div className='w-full'>
        <div className='w-[50%] mx-auto'>
          <h1>Cart is empty</h1>
          <Link to="/" className='bg-green-300 p-2 inline-block'>Go to Home Page</Link>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='w-[95%] md:w-[800px] mx-auto'>
        <Link to={`/restaurantMenu/${resInfo.id}`}>
          <div className='my-10 flex gap-5'>
            <img
              className='rounded-xl w-40 aspect-square'
              src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${resInfo.cloudinaryImageId}`}
              alt="Restaurant"
            />
            <div>
              <p className='text-5xl border-b-2 border-black pb-3'>{resInfo.name}</p>
              <p className='mt-3 text-xl'>{resInfo.areaName}</p>
            </div>
          </div>
        </Link>
        <hr className='my-5 border-2'/>
        <div>
          {cartData.map((item, i) => {
            const { name, defaultPrice, price, itemAttribute, ratings: { aggregatedRating: { rating, ratingCountV2 } }, description, imageId } = item;
            const trimmedDescription = description?.length > 138 ? `${description.substring(0, 138)}...` : description;

            return (
              <React.Fragment key={i}>
                <div className='flex w-full my-5 justify-between h-[180px]'>
                  <div className='w-[55%] md:w-[70%]'>
                    <img src={(itemAttribute && itemAttribute?.vegClassifier === "VEG" ? vegSymbol : nonVegSymbol)} alt="Veg/Non-Veg" className='w-5 rounded-sm' />
                    <h2 className='font-bold text-lg'>{name}</h2>
                    <p className='font-bold text-lg'>₹{(defaultPrice || price) / 100}</p>
                    <p className='flex items-center gap-1'>
                      <i className='fi text-xl fi-ss-star'></i>
                      <span>{rating} ({ratingCountV2})</span>
                    </p>
                    <div className='line-clamp-2'>{trimmedDescription}</div>
                  </div>
                  <div className=' w-[40%] md:w-[20%] relative h-full'>
                    <img
                      className='rounded-xl aspect-square'
                      src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${imageId}`}
                      alt="Item"
                    />
                    <button onClick={() => handleRemoveFromCart(i)} className='bg-white absolute bottom-[-8px] left-1/2 -translate-x-1/2 text-base text-red-700 font-bold rounded-xl border px-5 py-2 drop-shadow-sm'>
                      Remove
                    </button>
                  </div>
                </div>
                <hr className='my-10' />
              </React.Fragment>
            );
          })}
        </div>
        <h1 className='text-2xl'>Total <span className='font-bold'>₹{totalPrice}</span></h1>
        <div className='flex justify-between'>
          <button onClick={handlePlaceOrder} className='p-3 bg-green-700 rounded-lg my-7'>Place Order</button>
          <button onClick={handleClearCart} className='p-3 bg-green-700 rounded-lg my-7'>Clear Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;