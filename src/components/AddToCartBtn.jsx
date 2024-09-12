import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../utils/cartSlice";
import toast from "react-hot-toast";

const AddToCartBtn = ({info,resInfo,handleIsDiffRes}) => {
    const cartData = useSelector((state) => state.cartSlice.cartItems);
    const getResInfoFromLocalStorage = useSelector(state => state.cartSlice.resInfo);
    const dispatch = useDispatch();

    
    const handleAddToCart = () => {
        const isAdded = cartData?.find((data) => data?.id === info?.id);

        if (!isAdded) {
            if (getResInfoFromLocalStorage.name === resInfo?.name || getResInfoFromLocalStorage.length === 0) {
                dispatch(addToCart({ info, resInfo }));
                toast.success("Food added to the cart");
            } else {
                toast.error("Different restaurant");
                handleIsDiffRes();
            }
        } else {
            toast.error("Already added");
        }
    }
  return (
    <button
      onClick={handleAddToCart}
      className="bg-white absolute bottom-[-8px] left-1/2 -translate-x-1/2 text-lg text-green-700 font-bold rounded-xl border px-10 py-2 drop-shadow-sm"
    >
      Add
    </button>
  );
};

export default AddToCartBtn;
