const SectionTitle = ({ subHeading, heading }) => {
    return (
        <div className="mx-auto text-center md:w-4/12 my-12 relative">
            {}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full opacity-5 pointer-events-none select-none">
                <h2 className="text-6xl md:text-8xl font-bold text-gray-400 tracking-widest whitespace-nowrap overflow-hidden">
                    {heading}
                </h2>
            </div>

            <div className="relative z-10">
                <p className="text-orange-500 font-medium italic mb-3 tracking-wide flex items-center justify-center gap-2">
                    <span className="h-[1px] w-8 bg-orange-400"></span>
                    {subHeading}
                    <span className="h-[1px] w-8 bg-orange-400"></span>
                </p>

                <h3 className="text-3xl md:text-4xl font-bold uppercase text-gray-800 border-y-4 border-gray-200 py-4 px-2 inline-block">
                    {heading}
                </h3>
            </div>
        </div>
    );
};

export default SectionTitle;