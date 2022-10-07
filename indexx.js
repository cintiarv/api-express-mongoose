import mongoose from "mongoose";
import express from 'express'
import { StatusHttp } from './errorCustom.js'

import {Koder} from './models/koders.models.js'

/* const {DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env 
 */

const URL = 'cintia:Corpos90.@clustercin.7r8cwmi.mongodb.net/?retryWrites=kodemia&w=majority'

const server = express()
dotenv.config() // cargar todas la variables de entorno

//middleware
server.use(express.json())



mongoose.connect(URL)
    .then((conecction) => {
        console.log('Database conected!');

        server.listen(8080, () => {
            console.log('Server listening on port 8080'); //primero asegurar la conexión a la base de datos y después ponemos a escuchar el servidor 
        })
    })
    .catch(err => console.error(err))


   //Routers o endpoints 
server.get('/koders', async(request, response) => {
    const allKoders = await Koder.find({})
    response.json({
        succes:true,
        data: {
            koders: allKoders
        }
    })
})

//POST /koders
server.post('/koders', async (request, response) => {
    try { //happy path
        const {body: newKoder} = request

        const koderCreated = await Koder.create(newKoder)
    
        response.json({
            succes:true,
            msg:'koder creado'
        })

    } catch (err) { //catch maneja el error
        response.status(400).json({
            succes: false,
            msg: error.msg
        })
    }
})

//GET /koders /:id

server.get('/koders/:id', async (request, response) => {
  try{  
    const {id} = request.params
    const koderFound = await Koder.findById()

    /* if(!koderFound){
        response.status(404).json({
            succes:false,
            message:'koder no encontrado'
    })
    return 
} */
    if(!koderFound){
        throw new StatusHttp('Koder no encontrado')
    }
    response.json({
        succes:true,
        data: {
            koder:koderFound
        }
    })
} catch (error){
    response.status(400).json({
        succes: false,
        message: error.message
    })
}

})
