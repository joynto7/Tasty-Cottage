import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaBook, FaDollarSign, FaUsers, FaUtensils } from 'react-icons/fa';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, PieChart, Pie, Legend, ResponsiveContainer } from 'recharts';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {} } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin-stats');
            return res.data;
        }
    });

    const { data: chartData = [] } = useQuery({
        queryKey: ['order-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/order-stats');
            console.log('Order Stats Data:', res.data);
            return res.data;
        }
    });

    
    const getPath = (x, y, width, height) => {
        return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
        ${x + width / 2}, ${y}
        C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
        Z`;
    };

    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;

        return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };

    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const pieChartData = chartData.map(data => {
        return { name: data.category, value: data.revenue }
    })

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
                    <div className="stat-title">Revenue</div>
                    <div className="stat-value">${stats.revenue}</div>
                    <div className="stat-desc">Jan 1st - Feb 1st</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaUsers className='text-3xl'></FaUsers>
                    </div>
                    <div className="stat-title">Users</div>
                    <div className="stat-value">{stats.users}</div>
                    <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaBook className='text-3xl'></FaBook>
                    </div>
                    <div className="stat-title">Menu Items</div>
                    <div className="stat-value">{stats.menuItems}</div>
                    <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaUtensils className='text-3xl'></FaUtensils>
                    </div>
                    <div className="stat-title">Orders</div>
                    <div className="stat-value">{stats.orders}</div>
                    <div className="stat-desc">↘︎ 90 (14%)</div>
                </div>

            </div>
            {}
            <div className="flex flex-col lg:flex-row gap-8 mt-12">
                {}
                <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">
                        Order Trends
                    </h3>
                    <div className="h-[350px] w-full flex items-center justify-center">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis
                                        dataKey="category"
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
                                        dataKey="quantity"
                                        fill="#8884d8"
                                        shape={<TriangleBar />}
                                        label={{ position: 'top', fill: '#6b7280', fontSize: 12 }}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-gray-400">
                                <p className="text-lg font-medium">No Order Data Available</p>
                                <p className="text-sm">Place some orders to see trends here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">
                        Revenue Distribution
                    </h3>
                    <div className="h-[350px] w-full flex items-center justify-center">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={120}
                                        innerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        paddingAngle={5}
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-gray-400">
                                <p className="text-lg font-medium">No Revenue Data Available</p>
                                <p className="text-sm">Sales data will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
