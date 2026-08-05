import axios from "axios";


const axiosClient = axios.create({

   //baseURL: 'https://192.168.0.90:8000/api/'
   baseURL: 'http://127.0.0.1:8000/api/'
   //baseURL: ' http://10.91.122.231:8000/api/'
   //baseURL: 'http://192.168.0.90:8000/api/'
})

axiosClient.interceptors.request.use((config)=>{
   if (localStorage.getItem('Token')){

    const token = localStorage.getItem('Token')
     config.headers.Authorization =  `Bearer ${token}`

    /*if (echo && echo.socketId){
       const socketId = echo.socketId();
       if (socketId){
         config.headers['x-socket-ID'] = socketId;
       }
    }*/


   }

   return config
})

axiosClient.interceptors.response.use((response) =>{

    return response
},(error)=>{

   try {
    const {response} = error

     if (response.status === 401){
     localStorage.removeItem('ACCESS_TOKEN')
     console.log('Unauthorized User')
    }
    if (response.status === 402){
     localStorage.removeItem('ACCESS_TOKEN')
     console.log('Deactivated User')
    }
    console.log(error)
   }catch (e){
    console.log(`Error: ${e}`)
   }

 throw error


})

export default axiosClient