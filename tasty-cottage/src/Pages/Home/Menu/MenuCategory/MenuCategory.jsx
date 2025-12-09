import MenuItem from "../../Shared/MenuItem/MenuItem";
import Cover from "../../Shared/Cover/Cover";
import { Link } from "react-router-dom";

const MenuCategory = ({ items, title, img }) => {
    return (
       <div className='pt-12 pb-20'>
    {}
    {title && <Cover img={img} title={title}></Cover>}

    {}
    {}
    <div className="container mx-auto px-4 shadow-2xl rounded-xl py-14 my-24 bg-amber-50"> 
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {
                items.map(item => <MenuItem
                    key={item._id}
                    item={item}
                ></MenuItem>)
            }
        </div>
    </div>
    
    {}
    <div className="flex justify-center mt-8 group"> 
        <Link to={`/order/${title}`}>
            <button className="btn btn-lg btn-ghost border-0 border-b-4 border-black 
                                hover:bg-black hover:text-white 
                                transition duration-300 ease-in-out 
                                uppercase tracking-widest px-10 
                                
                                /* Custom Pulsing Effect */
                                group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/50">
                {}
                Order {title ? title : 'Now'}
            </button>
        </Link>
    </div>
</div>
    );
};

export default MenuCategory;