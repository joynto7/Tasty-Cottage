import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import React from "react";
import featuredImg from "../../../assets/home/featured.jpg";
import   "./Featured.css"


const Featured = () => {
    return (
        <div className="featured-item  text-white pt-8 my-20 bg-fixed   ">
            <SectionTitle subHeading="Check it out" heading="Featured Item"></SectionTitle>
            <div className="md:flex justify-cneter items-center  bg-[#151515]/60  pb-20 pt-12 px-36">
              <div>
              <img  src={ featuredImg} alt="" />
              </div>
              <div className="md:ml-10 space-y-4">
                 <p>Aug22,2030</p>
                 <p className="uppercase">where can i get some?</p>
                 <p className="text-gray-300 leading-relaxed mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident tempora doloremque possimus praesentium quod consectetur nisi sunt animi voluptatem deleniti, veniam voluptatum natus? Tenetur eum hic, earum cumque voluptate eaque.</p>
                 <button className="btn btn-outline border-0 border-b-4 mt-4">Order Now </button>
              </div>
            </div>
        </div>
    );
};
export default Featured;