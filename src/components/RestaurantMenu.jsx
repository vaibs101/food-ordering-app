import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Coordinates } from '../context/contextApi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart } from '../utils/cartSlice';
import toast from 'react-hot-toast';
import { nonveg, veg } from '../utils/constant';
import AddToCartBtn from './AddToCartBtn';
import { toggleDiffRes } from '../utils/toggleSlice';
import { MenuShimmer } from './Shimmer';


const RestaurantMenu = () => {
    const { id } = useParams();
    const [menuData, setMenuData] = useState([]);
    const [resInfo, setResInfo] = useState([]);
    const [discountData, setDiscountData] = useState([]);
    const [topPicksData, setTopPicksData] = useState(null);
    const { coord: { lat, lng } } = useContext(Coordinates);
    const [value, setValue] = useState(0);

    const cartData = useSelector((state) => state.cartSlice.cartItems);
    const getResInfoFromLocalStorage = useSelector((state) => state.cartSlice.resInfo);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchMenu();
    }, [lat, lng, id]);

    const fetchMenu = async () => {
        let mainId = id.split("-").at(-1).match(/\d+/g)?.join('');
        let data = await fetch(`${import.meta.env.VITE_BASE_URL}/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${mainId}`);
        const json = await data.json();
        let actualMenu = json?.data?.cards?.find((data)=>data?.groupedCard)
        
        const resInfo=json?.data?.cards?.find(data=>data?.card?.card?.["@type"].includes("food.v2.Restaurant")?.card?.card?.info);
        const discountInfo=json?.data?.cards?.find(data=>data?.card?.card?.["@type"].includes("v2.GridWidget")?.card?.card?.gridElements?.infoWithStyle?.offers);
        setResInfo(resInfo);
        setDiscountData(discountInfo);
        setTopPicksData(
            (actualMenu?.groupedCard?.cardGroupMap?.REGULAR?.cards)?.filter(
                data => data.card.card.title === "Top Picks")[0]);

        setMenuData(actualMenu?.groupedCard?.cardGroupMap?.REGULAR?.cards
            ?.filter(data => data?.card?.card?.itemCards || data?.card?.card?.categories)
            );
    }

    const handleNext = () => {
        setValue(prev => (prev >= 130 ? prev : prev + 31));
    }

    const handlePrev = () => {
        setValue(prev => (prev <= 0 ? prev : prev - 31));
    }

    const handleAddToCart = (info) => {
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

    const handleIsDiffRes = () => {
        setIsDiffRes(prev => !prev);
    }

    const handleClearCart = () => {
        dispatch(clearCart());
        handleIsDiffRes();
    }

    return (
        <div className='w-full'>
            {
                menuData?.length ?
                <div className='w-[95%] md:w-[800px] mx-auto pt-8'>
                <p className='text-[12px] text-slate-500 '>
                    <Link to="/"><span className='hover:text-slate-700 hover:cursor-pointer'>Home</span></Link> / 
                    <Link to="/"><span className='hover:text-slate-700 hover:cursor-pointer'>{resInfo?.city}</span></Link> / 
                    <span className='text-slate-700'>{resInfo?.name}</span>
                </p>
                <h1 className='font-bold pt-6 text-2xl'>{resInfo?.name}</h1>
                <div className='w-full h-[205px] bg-gradient-to-t from-slate-200/70  px-4 pb-4 mt-3 rounded-[30px] '>
                    <div className='w-full border border-slate-200/70 rounded-[30px] h-full bg-white'>
                        <div className='p-4 w-full'>
                            <div className='flex items-center gap-1 font-semibold'>
                                <i className="fi mt-1 fi-ss-circle-star text-green-600 text-lg"></i>
                                <span>{resInfo?.avgRating}</span>
                                <span>({resInfo?.totalRatingsString})</span>.
                                <span>{resInfo?.costForTwoMessage}</span>
                            </div>
                            <p className='underline font-semibold text-orange-600 text-sm'>{resInfo?.cuisines?.join(", ")}</p>
                            <div className='flex gap-2 mt-2'>
                                <div className='w-[7px] flex flex-col justify-center items-center'>
                                    <div className='w-[7px] h-[7px] bg-gray-500 rounded-full'></div>
                                    <div className='w-[1px] h-[25px] bg-gray-500'></div>
                                    <div className='w-[7px] h-[7px] bg-gray-500 rounded-full'></div>
                                </div>
                                <div className='flex flex-col gap-1 text-sm font-semibold'>
                                    <p>Outlet <span className='text-gray-400 font-normal'>{resInfo?.locality}</span></p>
                                    <p>{resInfo?.sla?.slaString}</p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='w-full'>
                            <div className='flex items-center p-4'>
                                {
                                    resInfo?.expectationNotifiers ? (
                                        <>
                                            <img className="w-6" src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_40,h_40/${resInfo?.feeDetails?.icon}`} />
                                            <span className='text-sm ml-4 text-gray-400 font-normal'>{resInfo?.expectationNotifiers[0]?.enrichedText.replace(/<[^>]*>/g, "")}</span>
                                        </>
                                    ) : ("")
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full overflow-hidden'>
                    <div className='flex justify-between mt-8'>
                        <h1 className='font-bold text-xl'>Deals for you</h1>
                        <div className='flex gap-3'>
                            <div onClick={handlePrev} className={`cursor-pointer rounded-full w-9 h-9 flex justify-center ${value <= 0 ? "bg-gray-100" : "bg-gray-200"}`}>
                                <i className={`fi text-2xl mt-1 fi-rr-arrow-small-left ${value <= 0 ? "text-gray-300" : "text-gray-800"}`}></i>
                            </div>
                            <div onClick={handleNext} className={`cursor-pointer rounded-full w-9 h-9 flex justify-center ${value >= 130 ? "bg-gray-100" : "bg-gray-200"}`}>
                                <i className={`fi text-2xl mt-1 fi-rr-arrow-small-right ${value >= 130 ? "text-gray-300" : "text-gray-800"}`}></i>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-4 mt-5'>
                        {
                            discountData?.map((data,i) => (
                                <Discount key={i} data={data} />
                            ))
                        }
                    </div>
                </div>
                <h2 className='text-center mt-5'>MENU</h2>
                <div className='w-full mt-5 relative cursor-pointer'>
                    <div className='w-full p-3 rounded-xl font-semibold text-lg bg-slate-200 text-center'>Search for dishes</div>
                    <i className={"mt-1 fi fi-rr-search text-lg text-gray-700 absolute top-3 right-4"}></i>
                </div>
                {
                    topPicksData &&
                    <div className='w-full overflow-hidden'>
                        <div className='flex justify-between mt-8'>
                            <h1 className='font-bold text-xl'>{topPicksData?.card?.card?.title}</h1>
                            <div className='flex gap-3'>
                                <div onClick={handlePrev} className={`cursor-pointer rounded-full w-9 h-9 flex justify-center ${value <= 0 ? "bg-gray-100" : "bg-gray-200"}`}>
                                    <i className={`fi text-2xl mt-1 fi-rr-arrow-small-left ${value <= 0 ? "text-gray-300" : "text-gray-800"}`}></i>
                                </div>
                                <div onClick={handleNext} className={`cursor-pointer rounded-full w-9 h-9 flex justify-center ${value >= 130 ? "bg-gray-100" : "bg-gray-200"}`}>
                                    <i className={`fi text-2xl mt-1 fi-rr-arrow-small-right ${value >= 130 ? "text-gray-300" : "text-gray-800"}`}></i>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-4 mt-5'>
                            {
                                topPicksData?.card?.card?.carousel?.map(({ creativeId, dish: { info: { defaultPrice, price,id } } }) => (
                                    <div key={id} className='min-w-[390px] h-[395px] relative'>
                                        <img className="w-full h-full" src={"https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_292,h_300/" + creativeId} alt="" />
                                        <div className='absolute bottom-4 text-white flex justify-between w-full px-5'>
                                            <p>₹{defaultPrice / 100 || price / 100}</p>
                                            <button className='px-10 py-2 font-bold text-green-600 bg-white rounded-xl'>Add</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
                <div>
                    {
                        menuData?.map(({ card: { card } }, i) => (
                            <MenuCard key={i} card={card} resInfo={resInfo} />
                        ))
                    }
                </div>
            </div>
            :<MenuShimmer/>
            }
           
        </div>
    );
}

function Discount({ data: { info: { header, offerLogo, couponCode } } }) {
    return (
        <div className='flex gap-2 min-w-[328px] h-[76px] border p-3 rounded-2xl'>
            <img src={"https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96/" + offerLogo} alt="offer" />
            <div>
                <h2 className='font-bold text-xl'>{header}</h2>
                <p className='text-gray-500'>{couponCode}</p>
            </div>
        </div>
    );
}

function MenuCard({ card, resInfo }) {
    const [isOpen, setIsOpen] = useState(!!card["@type"]);

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    if (card.itemCards) {
        const { title, itemCards } = card;

        return (
            <>
                <div className='mt-7'>
                    <div className='flex justify-between'>
                        <h1 className={'font-bold text-' + (card["@type"] ? "xl" : "base")}>{title} ({itemCards?.length})</h1>
                        <i className={'fi text-xl fi-rr-angle-small-' + (isOpen ? "up" : "down")} onClick={toggleDropdown}></i>
                    </div>
                    {
                        isOpen && <DetailMenu itemCards={itemCards} resInfo={resInfo} />
                    }
                </div>
                <hr className={'my-5 border-' + (card["@type"] ? "[10px]" : "[4px]")}></hr>
            </>
        );
    } else {
        const { title, categories } = card;
        return (
            <div>
                <h1 className='font-bold text-xl'>{title}</h1>
                {
                    categories?.map((data, i) => (
                        <MenuCard key={i} card={data} resInfo={resInfo} />
                    ))
                }
            </div>
        );
    }
}

function DetailMenu({ itemCards, resInfo }) {
    return (
        <div className='my-5'>
            {
                itemCards?.map(({ card: { info } }, i) => (
                    <DetailMenuCard key={i} info={info} resInfo={resInfo} />
                ))
            }
        </div>
    );
}

function DetailMenuCard({ info, resInfo }) {
    const { name, defaultPrice, price, itemAttribute, ratings: { aggregatedRating: { rating, ratingCountV2 } }, description, imageId } = info;
    const [isMore, setIsMore] = useState(false);
    const trimDes = description?.substring(0, 138) + "...";
    //const cartData = useSelector((state) => state.cartSlice.cartItems);
    //const [isDiffRes, setIsDiffRes] = useState(false);
    const dispatch = useDispatch();
   const isDiffRes=useSelector((state)=>state.toggleSlice.isDiffRes);
   

    const handleIsDiffRes = () => {
dispatch(toggleDiffRes())
    }

    const handleClearCart = () => {
        dispatch(clearCart());
        handleIsDiffRes();
    }


    return (
        <div className='relative w-full'>
            <div className='flex w-full justify-between h-[180px]'>
                <div className='w-[55%] md:w-[70%]'>
                    <img src={(itemAttribute && itemAttribute?.vegClassifier === "VEG" ? veg : nonveg)} alt="" className='w-5 rounded-sm'></img>
                    <h2 className='font-bold text-lg'>{name}</h2>
                    <p className='font-bold text-lg'>₹{defaultPrice / 100 || price / 100}</p>
                    <p className='flex items-center gap-1'><i className='fi text-xl fi-ss-star'></i>
                        <span>{rating} ({ratingCountV2})</span></p>
                    {description?.length > 140 ?
                        <div>
                            <span className='line-clamp-2 md:line-clamp-none'>{isMore ? description : trimDes}</span>
                            <button className='hidden md:block font-bold' onClick={() => setIsMore(!isMore)}>{isMore ? "less" : "more"}</button>
                        </div>
                        :
                        <span className=''>{description}</span>
                    }
                </div>
                <div className='w-[40%] md:w-[20%] relative h-full'>
                    <img className='rounded-xl aspect-square' src={"https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/" + imageId} alt=""></img>
                 <AddToCartBtn info={info} resInfo={resInfo} handleIsDiffRes={handleIsDiffRes}/>
                </div>
            </div>
            <hr className='my-5'></hr>
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
        </div>
    );
}

export default RestaurantMenu;