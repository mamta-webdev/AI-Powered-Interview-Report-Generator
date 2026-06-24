import { createContext,useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()            //createContext is a react built-in function-->rightnow it is empty-->laater we'll put data inside it

export const AuthProvider = ( {children}) =>{
    const [user, setUser] = useState(null)           //login bydefault, no user is logged in so we set it as null
    const [loading, setLoading] = useState(true)         //bydefault loading is set sa false


    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>          
            {children}
        </AuthContext.Provider>
    )

}
//Any component wrapped by AuthProvider can now access these values using the useContext hook
//.Provider is inbuilt component with createContext it is the gateway that sends data to all components