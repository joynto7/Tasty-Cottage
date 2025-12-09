import { useForm } from "react-hook-form";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { FaUtensils, } from "react-icons/fa";
import useAxiousPublic from "../../../hooks/useAxiosPublic"
import useAxiousSecure from "../../../hooks/useAxiosSecure"
import Swal from 'sweetalert2'

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const AddItems = () => {
    const { register, handleSubmit,reset } = useForm();
    const axiosPublic = useAxiousPublic();
    const axiousSecure = useAxiousSecure();



    const onSubmit = async (data) => {
        console.log(data)

        
        const formData = new FormData();

        
        
        formData.append('image', data.image[0]);

        
        const res = await axiosPublic.post(img_hosting_api, formData, {
            
            
            
            headers: {
                'content-type': 'multipart/form-data'
                
            }
        });
        if (res.data.success) {
            const menuItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                recipe: data.recipe,
                img: res.data.data.display_url
            }

            const menuRes = await axiousSecure.post('/menu', menuItem);
            console.log(menuRes.data)
            if (menuRes.data.insertedId) {
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${data.name} is added to the menu.`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }


        }

        console.log(res.data);

    };


    return (
        <div className="p-4 md:p-10 bg-gray-50 min-h-screen">

            <SectionTitle heading="Add an Item" subHeading="what's new" />

            {}
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-2xl border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-lg text-gray-700">Recipe Name <span className="text-red-500">*</span></span>
                        </label>
                        <input
                            type="text"
                            placeholder="A descriptive and catchy name for the recipe"
                            {...register("name", { required: true })}
                            required
                            className="input input-bordered input-lg w-full focus:ring-2 focus:ring-yellow-500 transition duration-200" />
                    </div>

                    {}
                    <div className="flex flex-col md:flex-row gap-6">

                        {}
                        <div className="form-control w-full md:w-1/2">
                            <label className="label">
                                <span className="label-text font-semibold text-lg text-gray-700">Category <span className="text-red-500">*</span></span>
                            </label>
                            <select
                                {...register("category", { required: true })}
                                className="select select-bordered select-lg w-full focus:ring-2 focus:ring-yellow-500 transition duration-200"
                                defaultValue="">

                                <option value="" disabled>Select a category</option>
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">Soup</option>
                                <option value="deserts">Desserts</option>
                                <option value="drink">Drinks</option>
                            </select>
                        </div>

                        {}
                        <div className="form-control w-full md:w-1/2">
                            <label className="label">
                                <span className="label-text font-semibold text-lg text-gray-700">Price <span className="text-red-500">*</span></span>
                            </label>
                            <input
                                type="number"
                                step="0.01" 
                                placeholder="e.g., 14.99"
                                {...register("price", { required: true, valueAsNumber: true })}
                                className="input input-bordered input-lg w-full focus:ring-2 focus:ring-yellow-500 transition duration-200" />
                        </div>
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-lg text-gray-700">Recipe Details <span className="text-red-500"></span></span>
                        </label> <br />
                        <textarea

                            className="textarea textarea-bordered h-32 p-4 text-base focus:ring-2 focus:ring-yellow-500 transition duration-200"
                            placeholder="Describe the recipe ingredients, preparation method, and serving suggestions."></textarea>
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-lg text-gray-700">Upload Image <span className="text-red-500">*</span></span>
                        </label>

                        {}
                        <div className="flex items-center space-x-4">
                            <input
                                {...register("image", { required: true })}
                                type="file"
                                className="file-input file-input-bordered file-input-warning w-full max-w-xs" />

                            {}
                        </div>
                    </div>

                    {}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="btn bg-gradient-to-r from-yellow-600 to-yellow-800 text-white hover:from-yellow-700 hover:to-yellow-900 btn-lg shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
                            Add Item <FaUtensils className="ml-2 text-xl" />
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddItems;