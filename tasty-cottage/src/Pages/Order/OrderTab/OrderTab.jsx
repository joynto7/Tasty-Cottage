import FoodCard from "../../../components/SectionTitle/FoodCard/FoodCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


const chunkArray = (array, chunkSize) => {
    if (!array) return [];
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        results.push(array.slice(i, i + chunkSize));
    }
    return results;
};

const OrderTab = ({ items = [] }) => {
    
    const ITEMS_PER_PAGE = 6;

    
    const pages = chunkArray(items, ITEMS_PER_PAGE);

    const pagination = {
        clickable: true,
        
        renderBullet: function (index, className) {
            return `<span class="${className} p-2 w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold bg-orange-500 text-white transition-all duration-300 hover:bg-orange-700 mx-1 cursor-pointer">${index + 1}</span>`;
        },
    };

    return (
        <div className='max-w-7xl mx-auto py-10'>
            {}
            {items.length > 0 ? (
                <Swiper
                    pagination={pagination}
                    modules={[Pagination]}
                    
                    className="mySwiper p-4"
                    spaceBetween={30}
                >
                    {}
                    {pages.map((pageItems, index) => (
                        <SwiperSlide key={index} className="pb-16 pt-2">
                            {}
                            <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center'>
                                {
                                    
                                    pageItems.map(item => (
                                        <FoodCard
                                            key={item._id}
                                            item={item}
                                        />
                                    ))
                                }
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p className="text-center text-xl text-gray-500 py-10">No items available in this category.</p>
            )}
        </div>
    );
};

export default OrderTab;