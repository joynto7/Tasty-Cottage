import { useEffect } from "react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import MenuItem from "../Shared/MenuItem/MenuItem";
import { useState } from "react";
import useMenu from "../../../hooks/useMenu";


const PopularMenu = () => {
    const [menu] = useMenu();
    const popular = menu.filter(item => item.category === 'popular');











return (
    <section className="mb-8 text-center">
        <SectionTitle subHeading="Popular Items"
            heading="From Our Menu">
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
            {
                popular.map(item => <MenuItem
                    key={item._id}
                    item={item}
                ></MenuItem>)
            }

        </div>

        <button className="btn btn-outline border-0 border-b-4 mt-4 ">View Full Menu </button>


    </section>
);
};

export default PopularMenu;