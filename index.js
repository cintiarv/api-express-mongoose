import mongoose from "mongoose";//para conectarnos a nuestra base de datos
import express from 'express'; //
import * as dotenv from 'dotenv' //seguridad de datos

dotenv.config()

import { StatusHttp } from './errorCustom.js'

import {Koder} from './models/koders.model.js'

const {DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env //datos guardados en .env 


const URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority` //uri que nos da mongo para podernos conectar 


const server = express() //levantando el servidor de express

//middleware
server.use(express.json()) //para poder recibir jsons no tener que convertirlos 






   //Routers o endpoints 
server.get('/koders', async(request, response) => {
    const allKoders = await Koder.find({}) //primero buscamos a todos 
    response.json({
        succes:true,
        data: {
            koders: allKoders
        }
    })
})

//POST /koders
server.post('/koders', async (request, response) => {
    try{
        const {body: newKoder} = request

        const koderCreated = await Koder.create(newKoder)
        console.log(koderCreated);
        response.json({
            succes:true,
            msg:'koder creado'
        })
    }catch(error){
        response.status(400).json({ //400, error del cliente
            succes: false, 
            message: error.message
        }) 
    }
      
})

//GET /koders /:id

server.get('/koders/:id', async (request, response) => {
  try{  
    const {id} = request.params
    const koderFound = await Koder.findById(id)

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


server.delete('/koders/:id', async (request, response) => {
    try{  
      let {id} = request.params
      const koderDeleted = await Koder.findByIdAndDelete(id) 
        console.log(koderDeleted);
        if(!koderDeleted){
            throw new StatusHttp('Koder no encontrado')
        }
        response.json({
            succes:true,
            data: {
                koder:koderDeleted
            }
        })
  } catch (error){
      response.status(400).json({
          succes: false,
          message: error.message
      })
  }
  
  })

  server.patch('/koders/:id', async (request, response) => {
    try{  
      let {id} = request.params
      const newData = {
        lastName: 'Ruiz Verdugo'
    }
    const koderUpdated = await Koder.findByIdAndUpdate(id, newData, {new: true})
    console.log(koderUpdated);

        if(!koderUpdated){
            throw new StatusHttp('Koder no encontrado')
        }
        response.json({
            succes:true,
            data: {
                koder:koderUpdated
            }
        })
  } catch (error){
      response.status(400).json({
          succes: false,
          message: error.message
      })
  }
  
  })

  






mongoose.connect(URL)
    .then((conecction) => {
        console.log('Database conected!');

        server.listen(8080, () => {
            console.log('Server listening on port 8080'); //primero asegurar la conexión a la base de datos y después ponemos a escuchar el servidor 
        })
    })
    .catch(error => console.error(error))