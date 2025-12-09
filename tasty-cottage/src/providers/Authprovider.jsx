import { createContext, useState, useEffect } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic"
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { app } from "../firebase/firebase.config";


export const AuthContext = createContext(null);


const auth = getAuth(app);

const AuthProvider = ({children}) => {

    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleprovider = new GoogleAuthProvider();
    const axiosPublic = useAxiosPublic();


    
    
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIN = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleprovider);
    }
    
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };


    
    
    useEffect(() => {
        
        let isMounted = true; 

        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            
            setUser(currentUser);
            
            if (currentUser) {
                
                const userInfo = { email: currentUser.email };
                axiosPublic.post('/jwt', userInfo)
                .then(res => {
                    if (res.data.token && isMounted) {
                        localStorage.setItem('access-token', res.data.token);
                    }
                })
                .finally(() => {
                    if (isMounted) { 
                        setLoading(false); 
                    }
                });

            } else {
                
                localStorage.removeItem('access-token');
                
                if (isMounted) {
                    setLoading(false); 
                }
            }
        });

        
        return () => {
            unsubscribe();
            isMounted = false; 
        };
        
    }, [axiosPublic]);

    
    const authInfo = {
        user,
        loading,
        createUser,
        signIN,
        googleSignIn,
        logOut
    };

    
    return(
       <AuthContext.Provider value={authInfo}>
           {children}
       </AuthContext.Provider>
    );
};

export default AuthProvider;