import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.context"
import { login,register,logout,getMe} from "../services/auth.api"

export const useAuth = ()=>{
    const context = useContext(AuthContext)   //we will use AUthContext data(user,setUser,loading,setLoading)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
    setLoading(true)
    try {
        const data = await login({ email, password })        //calling the login api
        setUser(data.user)         //login api send user in response so we set data.user ko setUser

        return { success: true, user: data.user }

    } catch (err) {

        return {
            success: false,
            message: err.response?.data?.message || "Login failed"
        }

    } finally {
        setLoading(false)
    }
}

    // const handleRegister = async ({ username, email, password })=>{
    //     setLoading(true)
    //     try{
    //         const data = await register({username,email,password})
    //         setUser(data.user)
    //     } catch(err){
    //         return {
    //         success: false,
    //         message: err.response?.data?.message || "Login failed"
    //     }
    //     } finally{
    //         setLoading(false)
    //     }  
    // }
    const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
        const data = await register({
            username,
            email,
            password
        });

        setUser(data.user);

        return {
            success: true,
            user: data.user
        };

    } catch (err) {
        return {
            success: false,
            message:
                err.response?.data?.message ||
                "Registration failed"
        };
    } finally {
        setLoading(false);
    }
};

    const handleLogOut = async () =>{
        setLoading(true)
        try{
            const data = await logout()
             setUser(null)
        } catch(err){

        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
    const getAndSetUser = async () => {
        try {
            const data = await getMe()
            setUser(data.user)
        } catch (err) {
            setUser(null) // IMPORTANT
        } finally {
            setLoading(false)
        }
    }

    getAndSetUser()
}, [])

    return { user,loading,handleRegister, handleLogin, handleLogOut}
}