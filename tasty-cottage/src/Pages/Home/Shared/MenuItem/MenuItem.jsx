
const MenuItem = ({ item }) => {
    const { name, recipe, price, image } = item;

    return (
        <div className="flex gap-6 items-start group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300">
            {}
            <img
                style={{ borderRadius: '0 200px 200px 200px' }}
                className="w-[120px] h-[120px] object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                src={image}
                alt={name}
            />

            {}
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-200" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {recipe}
                </p>
            </div>

            {}
            <div className="flex-shrink-0">
                <p className="text-2xl font-bold text-amber-600" style={{ fontFamily: 'Playfair Display, serif' }}>
                    ${price}
                </p>
            </div>
        </div>
    );
};

export default MenuItem;