import { useState } from 'react';
import orderCoverImg from '../../../assets/shop/order-bg.jpg';
import Cover from '../../Home/Shared/Cover/Cover';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useMenu from '../../../hooks/useMenu';
import OrderTab from '../OrderTab/OrderTab';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';


const Order = () => {
    const categories = ['salad', 'pizza', 'soup', 'dessert', 'drinks'];
    const { category } = useParams();
    const navigate = useNavigate();

    
    const initialIndex = categories.indexOf(category);
    const [tabIndex, setTabIndex] = useState(initialIndex === -1 ? 0 : initialIndex);

    const [menu] = useMenu();

    const desserts = menu.filter(item => item.category === 'dessert');
    const soup = menu.filter(item => item.category === 'soup');
    const pizza = menu.filter(item => item.category === 'pizza');
    const salad = menu.filter(item => item.category === 'salad');
    const drinks = menu.filter(item => item.category === 'drinks');

    const handleTabSelect = (index) => {
        setTabIndex(index);
        navigate(`/order/${categories[index]}`);
    };

    return (
        <div>
            <Helmet>
                <title>Tasty Cottage | Order Food</title>
            </Helmet>

            <Cover img={orderCoverImg} title="Order Food"></Cover>

            {}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <Tabs
                    selectedIndex={tabIndex}
                    onSelect={handleTabSelect}
                    className="custom-tabs"
                >
                    <TabList className="flex flex-wrap justify-center gap-3 mb-12 border-b-0">
                        <Tab className="px-8 py-3 font-semibold text-gray-600 cursor-pointer rounded-full transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 focus:outline-none" selectedClassName="bg-amber-500 text-white shadow-lg hover:bg-amber-600">
                            Salad
                        </Tab>
                        <Tab className="px-8 py-3 font-semibold text-gray-600 cursor-pointer rounded-full transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 focus:outline-none" selectedClassName="bg-amber-500 text-white shadow-lg hover:bg-amber-600">
                            Pizza
                        </Tab>
                        <Tab className="px-8 py-3 font-semibold text-gray-600 cursor-pointer rounded-full transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 focus:outline-none" selectedClassName="bg-amber-500 text-white shadow-lg hover:bg-amber-600">
                            Soup
                        </Tab>
                        <Tab className="px-8 py-3 font-semibold text-gray-600 cursor-pointer rounded-full transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 focus:outline-none" selectedClassName="bg-amber-500 text-white shadow-lg hover:bg-amber-600">
                            Desserts
                        </Tab>
                        <Tab className="px-8 py-3 font-semibold text-gray-600 cursor-pointer rounded-full transition-all duration-300 hover:bg-amber-50 hover:text-amber-600 focus:outline-none" selectedClassName="bg-amber-500 text-white shadow-lg hover:bg-amber-600">
                            Drinks
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <OrderTab items={salad}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={pizza}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={soup}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={desserts}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={drinks}></OrderTab>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
};

export default Order;