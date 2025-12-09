import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FaRocket, FaStar } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const AddReview = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(null);

    const onSubmit = async (data) => {
        const reviewData = {
            name: user?.displayName,
            email: user?.email,
            rating: rating,
            details: data.details,
            suggestion: data.suggestion,
            recipeLiked: data.recipeLiked,
            createdAt: new Date()
        };

        try {
            const res = await axiosSecure.post('/reviews', reviewData);
            if (res.data.insertedId) {
                reset();
                setRating(5);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Review submitted successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong! Please try again.",
            });
        }
    };

    return (
        <div className="w-full px-4 py-8">
            <SectionTitle heading="Give a Review" subHeading="Sharing is Caring" />

            <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-xl shadow-lg">

                {}
                <div className="flex flex-col items-center mb-8">
                    <h3 className="text-2xl font-serif font-bold mb-4">Rate Us!</h3>
                    <div className="flex gap-2">
                        {[...Array(5)].map((star, index) => {
                            const currentRating = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={currentRating}
                                        onClick={() => setRating(currentRating)}
                                        className="hidden"
                                    />
                                    <FaStar
                                        className="cursor-pointer transition-colors duration-200"
                                        size={40}
                                        color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(currentRating)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Which recipe you liked most?</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Recipe you liked most"
                            {...register("recipeLiked", { required: true })}
                            className="input input-bordered w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                        {errors.recipeLiked && <span className="text-red-500 text-sm mt-1">This field is required</span>}
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Do you have any suggestion for us?</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Suggestion"
                            {...register("suggestion", { required: true })}
                            className="input input-bordered w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                        {errors.suggestion && <span className="text-red-500 text-sm mt-1">This field is required</span>}
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Kindly express your care in a short way.</span>
                        </label>
                        <textarea
                            placeholder="Review in detail"
                            {...register("details", { required: true })}
                            className="textarea textarea-bordered h-32 w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        ></textarea>
                        {errors.details && <span className="text-red-500 text-sm mt-1">This field is required</span>}
                    </div>

                    {}
                    <button className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all shadow-md text-lg font-semibold">
                        Send Review <FaRocket />
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddReview;
