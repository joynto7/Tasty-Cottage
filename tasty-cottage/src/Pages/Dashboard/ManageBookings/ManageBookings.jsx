import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaTrashAlt, FaCheckCircle, FaClock, FaUserFriends, FaCalendarAlt } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const ManageBookings = () => {
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], refetch } = useQuery({
        queryKey: ['all-bookings'],
        queryFn: async () => {
            const res = await axiosSecure.get('/bookings');
            return res.data;
        }
    });

    const handleConfirm = async (item) => {
        const res = await axiosSecure.patch(`/bookings/${item._id}`, { status: 'confirmed' });
        if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${item.name}'s booking Confirmed!`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

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
                        text: "Booking has been deleted.",
                        icon: "success"
                    });
                }
            }
        });
    };

    return (
        <div className="w-full px-4 py-8">
            <SectionTitle heading="Manage All Bookings" subHeading="At a Glance" />

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100 mt-8">
                <table className="table w-full">
                    {}
                    <thead className="bg-orange-500 text-white">
                        <tr>
                            <th className="py-4 pl-6">#</th>
                            <th className="py-4">User Info</th>
                            <th className="py-4">Booking Details</th>
                            <th className="py-4">Status</th>
                            <th className="py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500 text-lg">
                                    No bookings found.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((item, index) => (
                                <tr key={item._id} className="hover:bg-orange-50 transition-colors border-b border-gray-100">
                                    <td className="pl-6 font-bold text-gray-600">{index + 1}</td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{item.name}</span>
                                            <span className="text-sm text-gray-500">{item.email}</span>
                                            <span className="text-xs text-gray-400">{item.phone}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 font-semibold text-gray-700">
                                                <FaCalendarAlt className="text-orange-500" /> {item.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FaClock className="text-orange-400" /> {item.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FaUserFriends className="text-gray-400" /> {item.guests} Guests
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {item.status === 'confirmed' ? (
                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold uppercase tracking-wider">
                                                Confirmed
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleConfirm(item)}
                                                className="btn btn-xs bg-orange-100 text-orange-600 border-none hover:bg-orange-200 flex items-center gap-1"
                                            >
                                                <FaCheckCircle /> Confirm?
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                                title="Delete Booking"
                                            >
                                                <FaTrashAlt className="text-lg" />
                                            </button>
                                        </div>
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

export default ManageBookings;
