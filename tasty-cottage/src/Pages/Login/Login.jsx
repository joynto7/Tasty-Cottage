import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import img from '../../assets/others/authentication2.jpg';
import img2 from '../../assets/others/authentication.png';
import { FaFacebookF, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import { AuthContext } from '../../providers/Authprovider';
import SocialLogin from '../../components/SectionTitle/SocialLogin/SocialLogin';



const Login = () => {
    
    const [captchaValue, setCaptchaValue] = useState('');
    
    const [disabled, setDisabled] = useState(true);
    
    const [captchaValid, setCaptchaValid] = useState(null);

    
    const [loading, setLoading] = useState(false);
    
    const [loginError, setLoginError] = useState(''); 


    const navigate = useNavigate();
    const location = useLocation();
    
    const from = location.state?.from?.pathname || "/"; 

    const { signIN } = useContext(AuthContext);

    
    useEffect(() => {
        loadCaptchaEnginge(6);
    }, []);

    
    const handleCaptchaInput = (e) => {
        setCaptchaValue(e.target.value);
        setCaptchaValid(null);
        setDisabled(true);
        setLoginError(''); 
    }

    
    const handleCaptchaSubmit = (e) => {
        e.preventDefault();

        if (validateCaptcha(captchaValue)) {
            setDisabled(false);
            setCaptchaValid(true);
        } else {
            setDisabled(true);
            setCaptchaValid(false);
            
            loadCaptchaEnginge(6); 
            setCaptchaValue('');
        }
    }

    const handleLogin = event => {
        event.preventDefault();

        if (disabled) {
            Swal.fire({
                icon: 'warning',
                title: 'CAPTCHA Required',
                text: 'Please validate the CAPTCHA before logging in.',
            });
            return; 
        }

        
        setLoginError('');
        setLoading(true);

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        
        
        
        
        

        signIN(email, password)
            .then(result => {
                const user = result.user;
                console.log(user);

                Swal.fire({
                    icon: 'success',
                    title: "Login Successful!",
                    text: `Welcome, ${user.email}`,
                    showClass: { popup: 'animate__animated animate__fadeInUp' },
                    hideClass: { popup: 'animate__animated animate__fadeOutDown' }
                });

                
                navigate(from, { replace: true });
            })
            .catch(error => {
                console.error("Login Error:", error);
                
                
                const errorMessage = error.message.includes('wrong-password') 
                                     ? 'Invalid password. Please try again.'
                                     : error.message.includes('user-not-found')
                                     ? 'No user found with that email.'
                                     : 'Login failed. Please check your credentials.';

                setLoginError(errorMessage);
                
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: errorMessage,
                });
            })
            .finally(() => {
                
                setLoading(false); 
                
                loadCaptchaEnginge(6); 
                setCaptchaValue('');
                setDisabled(true);
                setCaptchaValid(null);
            });
    };

    return (
        <>
            <Helmet>
                <title>Tasty Cottage | Login</title>
            </Helmet>

            {}
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="grid grid-cols-1 lg:grid-cols-2" style={{ backgroundImage: `url(${img2})` }}>

                        {}
                        <div className="illustration-section p-8 lg:p-12 flex flex-col justify-center items-center">
                            <p className="py-8 px-6 text-center text-3xl font-bold max-w-sm font-sans">
                                Tasty Cottage
                            </p>
                            <img
                                src={img}
                                alt="Login Illustration"
                                className="w-full max-w-sm h-auto object-cover shadow-xl rounded-lg mx-auto"
                            />
                        </div>

                        {}
                        <div className="card-body p-4 lg:p-12">
                            <h1 className="text-2xl text-center font-bold text-gray-800 mb-4">Login</h1>
                            <form onSubmit={handleLogin}>

                                {}
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold pb-3">Email</span></label>
                                    <input type="email" name="email" className="input input-bordered w-full" placeholder="Type here" required />
                                </div>

                                {}
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold pt-3 pb-2">Password</span></label>
                                    <input type="password" name="password" className="input input-bordered w-full" placeholder="Enter your password" required />
                                    <div className=''><label className="label"><a className="label-text-alt link link-hover">Forgot password?</a></label></div>
                                </div>
                                
                                {}
                                {loginError && (
                                    <p className="text-error text-sm mt-3 font-medium text-center">{loginError}</p>
                                )}

                                {}
                                <div className="form-control mt-4">
                                    <label className="label"><span className="label-text font-semibold pt-3 pb-3">Enter the Text Below</span></label>
                                    <div className='mb-2 border border-gray-300 rounded-lg p-3 bg-gray-50'>
                                        <LoadCanvasTemplate />
                                    </div>
                                    <div className="flex gap-2 items-center pb-3">
                                        <input
                                            type="text"
                                            name="captcha"
                                            className="input input-bordered w-full"
                                            placeholder="Type the CAPTCHA here"
                                            onChange={handleCaptchaInput}
                                            value={captchaValue}
                                            required
                                        />
                                        <button
                                            onClick={handleCaptchaSubmit}
                                            className="btn btn-outline btn-sm btn-info"
                                            type="button"
                                            disabled={captchaValue.length < 6}
                                        >
                                            Validate
                                        </button>
                                    </div>

                                    {}
                                    {captchaValid === true && (<p className="text-success text-sm mt-1 font-medium">✓ CAPTCHA Verified!</p>)}
                                    {captchaValid === false && (<p className="text-error text-sm mt-1 font-medium">✗ Incorrect. Try again.</p>)}
                                </div>

                                {}
                                <div className="form-control text-center mt-6">
                                    <button
                                        className="btn bg-[#daa14b] text-[#ffffff]"
                                        type="submit"
                                        disabled={disabled || loading} 
                                    >
                                        {loading ? <span className="loading loading-spinner"></span> : 'Login'}
                                    </button>
                                </div>

                                {}
                                <p className="text-center mt-4 text-sm text-[#daa14b]">
                                    New here? <Link to="/signup" className='link-hover text-[#daa14b] font-semibold'>Create a New Account</Link>
                                </p>
                            </form>

                            {}
                            <SocialLogin></SocialLogin>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;