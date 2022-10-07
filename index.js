import mongoose from 'mongoose'
import express, { response } from 'express'
import * as dotenv from 'dotenv'
import { Koder } from './koders.models'


dotenv.config()


const server = express()

//Routers

//query params

//middleware
server.use(express.json())

server.get('/koders', async (request, response) => {
    const allKoders = await Koder.find({})
    response.json({
        success: true,
        data: {
            koders: allKoders
        }
    })
})


server.post('/koders', async(request, response) => {

    try {
        const {body: newKoder} = request
        const koderCreated = await Koder.create(newKoder)
    
        response.json({
            success: true,
            message: 'Koder creado'
        })
    } catch(error) {
        response.status(400).json({
            success: false,
            message: error.message
        })
    }
})



const URL = 'cintia:Corpos90.@clustercin.7r8cwmi.mongodb.net/?retryWrites=kodemia&w=majority'

mongoose.connect(URL)
    .then((connection) => {
        console.log('Database connected');
        server.listen(8080, () => {
            console.log('Server listening on port 8080');
        })

    })
    .catch((error) => {
        console.log('Erorr: ', error);
    })


    server.get('/koders/:id', async (request, response) => {

        try{
            const {id} = request.params
            const koderFound = await Koder.findById(id)

            console.log(koderFound)

            // if(koderFound){
            //     response.json({
            //         success: false,
            //         message: 'Koder no encontado D:'
            //     })  
            //     return
            // }

            //lanzqar un error --- throw
            if(!koderFound)throw new StatusHttp('koder no encontradoD:', 404)
            
            response.json({
                success: true,
                data: {
                    koder: koderFound
                }
            })
        }catch (error){
            response.status(400).json({
                success: false,
                message: error.message
            })
        }
    })