import axios  from "axios"

 
const api = axios.create({         //create an instance of axios to prevent from repitive code
    baseURL:"http://localhost:3000",
    withCredentials:true
})

/**
 * 
 * @description these 4 functions will interact with the backend apis
 */

export async function register({username,email,password}) {
    try{
        const response = await api.post("/api/auth/register",{    //axios by default doesnt give cookies access, for that we need to use flag named as withCredentials
        username,email,password
      })
        return response.data

    }catch(err){
        console.log(err)
    }

}

export async function login({email,password}) {
    try{
        const response = await api.post("/api/auth/login",{
            email,password
        })
        return response.data

    }catch(err){
        console.log(err)
    }
}

export async function logout(){
    try{
        const response = await api.get("/api/auth/logout")
        return response.data

    }catch(err){

    }
}

export async function getMe(){
    try{
        const response = await api.get("/api/auth/get-me")
        return response.data

    }catch(err){
        console.log(err)
    }
}