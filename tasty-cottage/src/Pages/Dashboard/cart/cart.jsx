import Swal from "sweetalert2";
import useCart from "../../../hooks/useCart";
import { FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";

const Cart = () => {
    const [cart, refetch] = useCart();
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    const axiosSecure = useAxiosSecure();
    const handelDelete = id => {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                axiosSecure.delete(`/carts/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });

                        }
                    })
            }
        });

    }

    return (



        <div>
            <div className="flex justify-evenly items-center bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4">

                {}
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 ">Items</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">{cart.length}</p>
                </div>

                {}
                <div className="border-l border-gray-300 h-10 mx-3"></div>

                {}
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Total Price</p>
                    <p className="text-xl font-bold text-green-600 mt-1">${totalPrice}</p>
                </div>

                {}
                <div className="border-l border-gray-300 h-10 mx-3"></div>

                {}
                <Link to="/dashboard/payment">
                    <button disabled={!cart.length}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold text-base rounded-md 
                       shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out"
                    >
                        Pay Now
                    </button>
                </Link>
            </div>

            <div className="overflow-x-auto ">
                <table className="table w-full">
                    {}
                    <thead>
                        <tr>
                            <th>
                                #

                            </th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Action</th>

                        </tr>
                    </thead>

                    <tbody>

                        {
                            cart.map((item, index) => <tr key={item._id}>
                                <th>
                                    {index}
                                </th>

                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src={item.image}
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>

                                    </div>
                                </td>

                                <td>
                                    {item.name}
                                </td>

                                <td>${item.price}</td>

                                <th>
                                    <button
                                        onClick={() => handelDelete(item._id)}
                                        className="btn btn-ghost btn-lg  ">
                                        <FaTrash className="text-red-600"></FaTrash>
                                    </button>
                                </th>
                            </tr>)
                        }



                    </tbody>


                </table>
            </div>

        </div>



    );

};

export default Cart;