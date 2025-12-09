import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import Swal from 'sweetalert2';
import { FaTrashAlt, FaCalendarCheck, FaClock, FaUserFriends } from 'react-icons/fa';

const MyBookings = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], refetch } = useQuery({
        queryKey: ['bookings', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/bookings?email=${user.email}`);
            return res.data;
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/bookings/${id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your booking has been cancelled.",
                        icon: "success"
                    });
                }
            }
        });
    };

    return (
        <div className="w-full px-4 py-8">
            <SectionTitle heading="My Bookings" subHeading="Manage Your Reservations" />

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100 mt-8">
                <table className="table w-full">
                    {}
                    <thead className="bg-orange-500 text-white">
                        <tr>
                            <th className="py-4">#</th>
                            <th className="py-4">Details</th>
                            <th className="py-4">Guests</th>
                            <th className="py-4">Status</th>
                            <th className="py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500 text-lg">
                                    No bookings found. Book a table now!
                                </td>
                            </tr>
                        ) : (
                            bookings.map((item, index) => (
                                <tr key={item._id} className="hover:bg-orange-50 transition-colors border-b border-gray-100">
                                    <td className="font-bold text-gray-600">{index + 1}</td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 font-semibold text-gray-800">
                                                <FaCalendarCheck className="text-orange-500" />
                                                {item.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FaClock className="text-orange-400" />
                                                {item.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 font-medium text-gray-700">
                                            <FaUserFriends className="text-gray-400" />
                                            {item.guests} People
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === 'confirmed'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {item.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                            title="Cancel Booking"
                                        >
                                            <FaTrashAlt className="text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBookings;
