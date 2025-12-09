import { FaAd, FaBook, FaCalendar, FaEnvelope, FaHamburger, FaHome, FaList, FaSearch, FaShoppingCart, FaUsers, FaUtensils, } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

const Dashboard = () => {

    
    const [isAdmin] = useAdmin();

    
    const getLinkClass = ({ isActive }) => {
        
        const base = "flex items-center gap-3 p-3 rounded-lg font-medium w-full transition duration-200 ease-in-out";

        
        return isActive
            ? `${base} bg-orange-600 text-white shadow-md` 
            : `${base} text-gray-900 bg-transparent hover:bg-orange-500 hover:text-white`; 
    };

    return (
        <div className="flex">

            {}
            <div className="w-64 mr-7 min-h-screen bg-orange-400 p-4">

                <h2 className="text-3xl font-bold text-gray-900 mb-6 px-4">Menu</h2>

                <ul className="space-y-2"> {}


                    {
                        isAdmin ? <>

                            <li>
                                <NavLink to="/dashboard/adminHome" className={getLinkClass}>
                                    <FaHome />Admin Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/addItems" className={getLinkClass}>
                                    <FaUtensils /> Add Items
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/manageItems" className={getLinkClass}>
                                    <FaList /> Manage Items
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/manageBookings" className={getLinkClass}>
                                    <FaBook /> Manage Bookings
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/users" className={getLinkClass}>
                                    <FaUsers /> All Users
                                </NavLink>
                            </li>
                        </>
                            :
                            <>
                                <li>
                                    <NavLink to="/dashboard/userHome" className={getLinkClass}>
                                        <FaHome />User Home
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/cart" className={getLinkClass}>
                                        <FaShoppingCart />My Cart
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/reservation" className={getLinkClass}>
                                        <FaCalendar /> Reservation
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/review" className={getLinkClass}>
                                        <FaAd /> AddReview
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/bookings" className={getLinkClass}>
                                        <FaList /> My Bookings
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/paymentHistory" className={getLinkClass}>
                                        <FaList /> Payment History
                                    </NavLink>
                                </li>
                            </>
                    }
                </ul>

                <div className="divider my-6 before:bg-orange-500 after:bg-orange-500"></div>


                {}


                <ul className="space-y-2">

                    <li>
                        <NavLink to="/" className={getLinkClass}>
                            <FaHome /> Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/menu" className={getLinkClass}>
                            <FaSearch /> Our Menu
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/order/salad" className={getLinkClass}>
                            <FaHamburger /> Order Food
                        </NavLink>
                    </li>

                    <li>

                        <NavLink to="/order/contact" className={getLinkClass}>
                            <FaEnvelope /> Contact
                        </NavLink>
                    </li>
                </ul>

            </div>

            {}
            <div className="flex-1 p-8 bg-gray-50">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;