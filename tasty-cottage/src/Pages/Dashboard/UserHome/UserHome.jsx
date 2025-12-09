import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaBook, FaDollarSign, FaShoppingCart, FaStar } from 'react-icons/fa';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, PieChart, Pie, Legend, ResponsiveContainer } from 'recharts';

const UserHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {} } = useQuery({
        queryKey: ['user-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user-stats?email=${user.email}`);
            return res.data;
        }
    });

    const barData = [
        { name: 'Orders', value: stats.orders || 0 },
        { name: 'Reviews', value: stats.reviews || 0 },
        { name: 'Cart', value: stats.cartItems || 0 },
        { name: 'Spent', value: stats.payment || 0 }
    ];

    const pieData = [
        { name: 'Total Paid', value: stats.payment || 0 },
        { name: 'Pending', value: (stats.cartItems * 10) || 0 }
    ];

    return (
        <div className="w-full m-4">
            <h2 className="text-3xl mb-5">
                <span>Hi, Welcome </span>
                {
                    user?.displayName ? user.displayName : 'Back'
                }
            </h2>
            <div className="stats shadow w-full">

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaDollarSign className='text-3xl'></FaDollarSign>
                    </div>
                    <div className="stat-title">Total Payment</div>
                    <div className="stat-value">${stats.payment || 0}</div>
                    <div className="stat-desc">Jan 1st - Feb 1st</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaShoppingCart className='text-3xl'></FaShoppingCart>
                    </div>
                    <div className="stat-title">Cart Items</div>
                    <div className="stat-value">{stats.cartItems || 0}</div>
                    <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaStar className='text-3xl'></FaStar>
                    </div>
                    <div className="stat-title">Reviews</div>
                    <div className="stat-value">{stats.reviews || 0}</div>
                    <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaBook className='text-3xl'></FaBook>
                    </div>
                    <div className="stat-title">Orders</div>
                    <div className="stat-value">{stats.orders || 0}</div>
                    <div className="stat-desc">↘︎ 90 (14%)</div>
                </div>

            </div>

            {}
            <div className="flex flex-col lg:flex-row gap-8 mt-12">
                {}
                <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">
                        Your Activity
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#FF8042"
                                    radius={[10, 10, 0, 0]}
                                    barSize={50}
                                >
                                    <Cell fill="#0088FE" />
                                    <Cell fill="#00C49F" />
                                    <Cell fill="#FFBB28" />
                                    <Cell fill="#FF8042" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {}
                <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">
                        Spending Overview
                    </h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#00C49F" />
                                    <Cell fill="#FFBB28" />
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
