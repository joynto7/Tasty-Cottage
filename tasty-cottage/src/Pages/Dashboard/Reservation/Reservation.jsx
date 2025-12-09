import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { FaCalendarAlt, FaClock, FaUserFriends, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';

const Reservation = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const onSubmit = async (data) => {
        const reservationData = {
            ...data,
            email: user?.email,
            status: 'pending',
            createdAt: new Date()
        };

        try {
            const res = await axiosSecure.post('/bookings', reservationData);
            if (res.data.insertedId) {
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Table booked successfully!",
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
            <SectionTitle heading="Book A Table" subHeading="Reservation" />

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-orange-500 p-6 text-center text-white">
                    <h2 className="text-3xl font-bold mb-2">Make a Reservation</h2>
                    <p className="opacity-90">We will confirm your booking via email</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold flex items-center gap-2">
                                <FaCalendarAlt className="text-orange-500" /> Date*
                            </span>
                        </label>
                        <input
                            type="date"
                            {...register("date", { required: true })}
                            className="input input-bordered w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                        {errors.date && <span className="text-red-500 text-sm mt-1">Date is required</span>}
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold flex items-center gap-2">
                                <FaClock className="text-orange-500" /> Time*
                            </span>
                        </label>
                        <input
                            type="time"
                            {...register("time", { required: true })}
                            className="input input-bordered w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                        {errors.time && <span className="text-red-500 text-sm mt-1">Time is required</span>}
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold flex items-center gap-2">
                                <FaUserFriends className="text-orange-500" /> Guests*
                            </span>
                        </label>
                        <select
                            defaultValue="2"
                            {...register("guests", { required: true })}
                            className="select select-bordered w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        >
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                            <option value="3">3 People</option>
                            <option value="4">4 People</option>
                            <option value="5">5 People</option>
                            <option value="6">6 People</option>
                            <option value="7+">7+ People</option>
                        </select>
                        {errors.guests && <span className="text-red-500 text-sm mt-1">Guest count is required</span>}
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold flex items-center gap-2">
                                <FaUser className="text-orange-500" /> Name*
                            </span>
                        </label>
                        <input
                            type="text"
                            defaultValue={user?.displayName}
                            placeholder="Your Name"
                            {...register("name", { required: true })}
                            className="input input-bordered w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                        {errors.name && <span className="text-red-500 text-sm mt-1">Name is required</span>}
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold flex items-center gap-2">
                                <FaPhone className="text-orange-500" /> Phone*
                            </span>
                        </label>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            {...register("phone", { required: true })}
                            className="input input-bordered w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                        {errors.phone && <span className="text-red-500 text-sm mt-1">Phone is required</span>}
                    </div>

                    {}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold flex items-center gap-2">
                                <FaEnvelope className="text-orange-500" /> Email*
                            </span>
                        </label>
                        <input
                            type="email"
                            defaultValue={user?.email}
                            readOnly
                            {...register("email")}
                            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {}
                    <div className="col-span-1 md:col-span-2 mt-4">
                        <button className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white w-full border-none hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg text-lg">
                            Book Table
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Reservation;
