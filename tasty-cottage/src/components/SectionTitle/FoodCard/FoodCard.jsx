import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCart from "../../../hooks/useCart";

const FoodCard = ({ item }) => {
    const { name, recipe = '', price, image, _id } = item || {};
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosSecure = useAxiosSecure();
    const [, refetch] = useCart();

    const handleAddToCart = () => {
        if (user && user.email) {
            const cartItem = {
                menuId: _id,
                email: user.email,
                name,
                image,
                price
            }

            axiosSecure.post('/carts', cartItem)
                .then(res => {
                    if (res.data.insertedId) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `${name} added to your cart!`,
                            showConfirmButton: false,
                            timer: 1500,
                            toast: true,
                        });
                        refetch();
                    }
                })
                .catch(error => {
                    console.error("Error adding to cart:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong! Could not add item to cart.",
                    });
                });
        } else {
            Swal.fire({
                title: "Login Required!",
                text: "Please login to add this item to your cart.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#D1A054",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, take me to login",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login', { state: { from: location } })
                }
            });
        }
    }

    return (
        <div className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group">
            {}
            <figure className="relative h-64 w-full overflow-hidden bg-gray-100">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {}
                <div className="absolute top-4 right-4 bg-amber-500 text-white font-bold py-2 px-4 rounded-full shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                    ${price.toFixed(2)}
                </div>
            </figure>

            {}
            <div className="card-body p-6 flex flex-col items-center text-center">
                {}
                <h2 className="card-title text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {name}
                </h2>

                {}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {recipe.length > 100 ? recipe.substring(0, 100) + '...' : recipe}
                </p>

                {}
                <div className="card-actions w-full">
                    <button
                        onClick={handleAddToCart}
                        className="btn w-full bg-transparent border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                        🛒 Add To Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;