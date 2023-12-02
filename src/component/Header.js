import React, { useState } from "react";
import logo from "../assets/logo.jpeg"
import { Link } from 'react-router-dom'
import { HiOutlineUserCircle } from "react-icons/hi"
import { BsCartFill } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { logoutRedux } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import "../App.css"
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleShowMenu = () => {
    setShowMenu((preve) => !preve);
  };
  const handleLogout = () => {
    dispatch(logoutRedux());
    toast("Logout successfully");
  };

  const productData = useSelector((state) => state.product.productList);
  const onChange = (event) => {
    setSearchValue(event.target.value);
    //filterProducts(event.target.value);
  }

  const filterProducts = (searchterm) => {
    const filter = productData.filter(
      (el) => el.name.toLowerCase().startsWith(searchterm.toLowerCase())

    );
    navigate("/menu/" / filter[0]._id)
    console.log(filter[0]._id);
  }
  // let test = (process.env.REACT_APP_ADMIN_EMAIL)
  // console.log(test)
  const cartItemNumber = useSelector((state) => state.product.cartItem)
  return (
    <header className='fixed shadow-md w-full h-16 px-2 md:px-4 z-50 bg-red-600'>
      <div className="flex items-center h-full justify-between">
        <Link to={""}>
          <div className='h-16 flex text-white items-center '>
            <img src={logo} className='h-full' />
           <h1 className="font-bold">GroceryHub</h1> 
          </div>
        </Link>
        <div className='flex items-center gap-4 md:gap-7'>
          <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <div className="search-container">
              <div className="search-inner">
                <input type="text" value={searchValue} placeholder="Search here" onChange={onChange} />
              </div>
              <div className="dropdown">
                {productData.filter(item => {
                  const searchTerm = searchValue.toLowerCase();
                  const productName = item.name.toLowerCase();
                  return searchTerm && productName.startsWith(searchTerm) && productName !== searchTerm;
                })
                  .map((item) => (
                    <div>
                    <Link to={`/menu/${item._id}`} className="dropdown-row" key={item.id} >{item.name}</Link>
                    <br></br>
                    </div>
                  ))}
                  
              </div>
            </div>
            <Link to={""}>Home</Link>
          </nav>
          <div className="text-2xl text-black-600 relative">
            <Link to={"cart"}>
              <BsCartFill />
              <div className="absolute -top-1 -right-1 text-white bg-black-600 h-4 w-4 rounded-full m-0 p-0 text-sm text-center ">
                {cartItemNumber.length}
              </div>
            </Link>
          </div>
          <div className=' bg-black-600 ' onClick={handleShowMenu}>
            <div className='text-3xl cursor-pointer w-8 h-8 rounded-full overflow-hidden drop-shadow-md' >
              {userData.image ? (
                <img src={userData.image} className="h-full w-full" />
              ) : (
                <HiOutlineUserCircle />
              )}
            </div>
            {
              showMenu && <div className='absolute right-2 bg-white py-2  shadow drop-shadow-md flex flex-col min-w-[120px] text-center'>
                {
                  userData.email === process.env.REACT_APP_ADMIN_EMAIL && <Link to={"newproduct"} className="whitespace-nowrap cursor-pointer px-2">New Product</Link>

                }


{
                  userData.email === process.env.REACT_APP_ADMIN_EMAIL && <Link to={"payment-analytics"} className="whitespace-nowrap cursor-pointer px-2">Analytics</Link>

                }
                {
                  userData.email === process.env.REACT_APP_ADMIN_EMAIL && <Link to={"manageuser"} className="whitespace-nowrap cursor-pointer px-2">ManageUser</Link>

                }
                {userData.email ? (
                  <p
                    className="cursor-pointer text-white px-2 bg-red-500"
                    onClick={handleLogout}
                  >
                    Logout ({userData.firstName}){" "}
                  </p>
                ) : (
                  <Link
                    to={"login"}
                    className="whitespace-nowrap cursor-pointer px-2"
                  >
                    Login
                  </Link>
                )}
                

              </div>
            }

          </div>
        </div>
      </div>
    </header>
  )
}

export default Header