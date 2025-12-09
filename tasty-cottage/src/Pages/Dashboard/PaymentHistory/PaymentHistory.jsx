import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { FaMoneyBillWave, FaCalendarAlt, FaHashtag } from 'react-icons/fa';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/${user.email}`)
            return res.data;
        }
    })

    return (
        <div className="w-full px-4 md:px-8 pb-12">
            <SectionTitle heading="Payment History" subHeading="At a Glance!" />

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaMoneyBillWave className="text-orange-600" />
                        Total Payments: {payments.length}
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {}
                        <thead className="bg-gray-50 text-gray-600 uppercase text-sm font-semibold">
                            <tr>
                                <th className="py-4 pl-6">#</th>
                                <th className="py-4">Amount</th>
                                <th className="py-4">Transaction ID</th>
                                <th className="py-4">Date</th>
                                <th className="py-4 pr-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {payments.map((payment, index) => (
                                <tr key={payment._id} className="hover:bg-orange-50 transition-colors duration-200 border-b border-gray-50 last:border-none">
                                    <th className="pl-6 font-medium text-gray-500">{index + 1}</th>
                                    <td className="font-bold text-gray-800 text-lg">
                                        ${payment.price}
                                    </td>
                                    <td className="font-mono text-sm text-gray-500">
                                        <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                                            <FaHashtag className="text-xs text-gray-400" />
                                            {payment.transactionId}
                                        </span>
                                    </td>
                                    <td className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400" />
                                            {new Date(payment.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="pr-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                                            ${payment.status === 'success' || payment.status === 'succeeded'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                            {payment.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {payments.length === 0 && (
                    <div className="text-center py-16 bg-gray-50">
                        <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center shadow-sm mb-4">
                            <FaMoneyBillWave className="text-3xl text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600">No payments found</h3>
                        <p className="text-gray-400 text-sm mt-1">Your payment history will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
