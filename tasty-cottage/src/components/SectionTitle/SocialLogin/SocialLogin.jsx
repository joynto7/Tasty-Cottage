
import { FaFacebookF, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../../hooks/useAuth';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useNavigate } from 'react-router-dom';

const SocialLogin = () => {

    const {googleSignIn} = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();


   const handelGoogleSignIn = () => {
        
        googleSignIn()
            .then(result => {
                console.log('Google Sign-in Success:', result.user);
                
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName
                };
                
                
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        console.log('User DB Entry Success:', res.data);
                        
                        navigate('/');      
                    })
                    
                    .catch(dbError => {
                        console.error('Error creating user in DB:', dbError);
                        
                    });
            })
            
            .catch(error => {
                
                console.error('Google Sign-in Failed:', error);

                
                
                
                
                
                
                
                
                
                
                
                
            });
    };

    return (
       
      <div>
          < div className = "divider text-gray-600 mt-6 mb-4" > Or sign in with</div >
            <div className="flex justify-center gap-4 mb-2">

                <button type="button" className="btn btn-circle btn-outline hover:border-blue-600">
                    <FaFacebookF className="text-xl text-blue-600" />
                </button>

                <button onClick={handelGoogleSignIn} type="button" className="btn btn-circle btn-outline hover:border-gray-300">
                    <FcGoogle className="text-2xl" />
                </button>

                <button type="button" className="btn btn-circle btn-outline hover:border-gray-800">
                    <FaGithub className="text-xl text-gray-800" />
                </button>
            </div>
      </div>
);
};
export default SocialLogin;