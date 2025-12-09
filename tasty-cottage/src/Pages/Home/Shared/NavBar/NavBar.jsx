import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../../providers/Authprovider";

import { FaShoppingCart } from 'react-icons/fa';
import useCart from "../../../../hooks/useCart";


const NavBar = () => {

  const { user, logOut } = useContext(AuthContext);
  const [cart = []] = useCart();

  const handelLogOut = () => {
    logOut()
      .then(() => { })
      .catch(error => console.error(error));
  }

  const navOptions = <>
    <li>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `font-semibold ${isActive ? 'text-amber-500' : ''
          }`
        }
      >
        Home
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/menu"
        className={({ isActive }) =>
          `font-semibold ${isActive ? 'text-amber-500' : ''
          }`
        }
      >
        Our Menu
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/order/salad"
        className={({ isActive }) =>
          `font-semibold ${isActive ? 'text-amber-500' : ''
          }`
        }
      >
        Order Food
      </NavLink>
    </li>
    <li>
      <Link to="/dashboard/cart" className="relative">
        <button className="btn btn-ghost btn-sm hover:bg-white/10 gap-2">
          <FaShoppingCart className="text-lg" />
          {cart?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
              {cart.length}
            </span>
          )}
        </button>
      </Link>
    </li>
  </>

  return (
    <>
      <div className="navbar fixed top-0 left-0 right-0 z-50 bg-base-100/[0.15] backdrop-blur-xl shadow-xl border-b border-base-300/30" style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      }}>

        <div className="navbar-start">
          { }
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 mt-3 w-52 p-2 shadow-lg rounded-box z-[20]"
            >
              {navOptions}
              {user ? (
                <li>
                  <button
                    onClick={handelLogOut}
                    className="font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="font-medium text-amber-600 hover:bg-amber-50"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          { }
          <Link
            to="/"
            className="text-xl font-bold hover:text-amber-500"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            TASTY COTTAGE
          </Link>
        </div>

        { }
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navOptions}
          </ul>
        </div>

        { }
        <div className="navbar-end gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              { }
              <span className="text-sm font-light text-base-content/90 hidden sm:inline max-w-[150px] truncate">
                {user.displayName || user.email}
              </span>

              { }
              <button
                onClick={handelLogOut}
                className="btn btn-sm btn-outline"
              >
                Logout
              </button>
            </div>
          ) : (

            <Link
              to="/login"
              className="btn btn-sm btn-primary"
            >
              Sign In
            </Link>
          )}
          { }

        </div>
      </div>
    </>
  );
};

export default NavBar;