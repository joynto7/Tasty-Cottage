import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 font-sans">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-6">

                {}
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>
                        TASTY COTTAGE
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Providing reliable food since 2021
                    </p>
                </div>

                {}
                <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-xl">
                        <FaFacebookF />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-xl">
                        <FaInstagram />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-xl">
                        <FaTwitter />
                    </a>
                </div>

                {}
                <div className="text-sm text-gray-600 border-t border-gray-800 w-full pt-6">
                    <p>Copyright © {new Date().getFullYear()} Tasty Cottage. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
export default Footer;