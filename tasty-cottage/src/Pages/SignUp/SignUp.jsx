import { useContext, useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../providers/Authprovider';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom'; 
import img from '../../assets/others/authentication2.jpg';
import img2 from '../../assets/others/authentication.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import SocialLogin from '../../components/SectionTitle/SocialLogin/SocialLogin';


const SignUp = () => {
    
    const axiosPublic = useAxiosPublic();
    const { createUser, loading } = useContext(AuthContext);
    const navigate = useNavigate(); 

    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    const password = watch("password");

    
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

    
    const onSubmit = (data) => {
        const { name, email, password, photoURL } = data; 

        console.log('Form Data:', data);

        
        createUser(email, password) 
            .then(result => {

                const userInfo = {
                    name: data.name ,
                    email: data.email
                }

               axiosPublic.post('/users',userInfo)
               .then(res => {

                if(res.data.insertedId){
                    console.log("User added to the database")
                }

               })
               reset();
                const user = result.user;
                console.log('User created successfully:', user);

                
                
                
                
                
                

                reset(); 

                
                navigate('/', { replace: true }); 
            })
            .catch(firebaseError => {
                console.error("Sign-up Error:", firebaseError.message);
                alert(`Sign-up failed: ${firebaseError.message}`);
            });
    };

    return (
        <>
            <Helmet>
                <title>Tasty Cottage | Sign UP</title>
            </Helmet>

            <div className="hero bg-base-200 min-h-screen">

                <div className="hero-content flex-col lg:flex-row-reverse">




                    <div className="grid grid-cols-4 lg:grid-cols-2" style={{ backgroundImage: `url(${img2})` }}>

                        {}
                        <div className="card  w-full max-w shrink-0 shadow-2xl lg:max-w">

                            <h1 className="text-2xl text-center font-bold pt-6 mb-4">Sign Up </h1>

                            <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                                <fieldset className="fieldset">

                                    {}
                                    <label className="label">
                                        <span className="label-text">Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="Name"
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}


                                    {}
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="input input-bordered w-full"
                                        placeholder="Email"
                                        {...register("email", { required: "Email is required" })}
                                    />
                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}


                                    {}
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            
                                            type={showPassword ? "text" : "password"}
                                            className="input input-bordered w-full pr-10" 
                                            placeholder="Password"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                                                pattern: {
                                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                                                    message: "Password must include 6+ chars, a number, a letter, and a special character."
                                                }
                                            })}
                                        />
                                        {}
                                        {}
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2 mt p-1 text-gray-500 hover:text-gray-700"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? (
                                                
                                                <FaEyeSlash className="text-xl" />
                                            ) : (
                                                
                                                <FaEye className="text-xl" />
                                            )}
                                        </button>

                                    </div>
                                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}


                                    {}
                                    <label className="label">
                                        <span className="label-text">Confirm Password</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="input input-bordered w-full pr-10" 
                                            placeholder="Confirm Password"
                                            {...register("confirmPassword", {
                                                required: "Confirm password is required",
                                                validate: value =>
                                                    value === password || "Passwords do not match"
                                            })}
                                        />

                                        {}
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2 mt p-1 text-gray-500 hover:text-gray-700"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? (
                                                
                                                <FaEyeSlash className="text-xl" />
                                            ) : (
                                                
                                                <FaEye className="text-xl" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}

                                    <div className="form-control text-[#ffffff] text-center mt-6">
                                        <button
                                            className="btn bg-[#daa14b]  text-[#ffffff]"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Signing Up...' : 'Sign Up'}
                                        </button>
                                    </div>

                                    {}
                                    <p className="text-center mt-4 text-sm text-[#D1A054]">
                                        Already registered?
                                        <Link to="/login" className="link link-hover ml-1 text-[#D1A054]">Go to log in</Link>
                                    </p>

                                </fieldset>
                            </form>

                            {}

                            <SocialLogin></SocialLogin>
              

                        </div>
                        

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



                    </div>


                </div>
            </div>
        </>
    );
};

export default SignUp;