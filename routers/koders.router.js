//requiero el modulo de express
//query params (friltros), rouetrs usbconjutno del ersver ppal que nos permite modularizar los endpoints que tengamos -> ocuparlo semánticamente(solo koders, solo mentores, etc)

import express from 'express'
import fs from 'fs'

const router = express.Router() //creando un router, un router es una ramificacion del server

//COPIAR Y PEGAR TODOS LOS ENDPOINTS DE KODERS DEL ARCHIVO INDEX.JS
//tengo que exportar a este router ya que mi server no lo conocer

    router.get('/', async (request, response) => { //cuando yo utilice un async await tengo que poner en una función asíncrono, se pone async al callback porque es la función que contiene la promesa 
        const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8')//trabajando con promesas
        const json = JSON.parse(dataFile)
        let koders = json.koders
    
        //accedo a los parámetros directamente en  primero es ? y después &
        const queries = request.query
        //destructurando para acceder a generacion
        console.log(queries);
    
        const {generation, gender} = request.query
        console.log('generation: ', generation);
    
        let kodersFiltered = json.koders;
        //validar si viene el query
        //string -> true
        //undefined -> false
        if(generation){
            kodersFiltered = kodersFiltered.filter(koder => koder.generation === parseInt(generation))
        }
        //ahora validar si viene gender
        if(gender){
            kodersFiltered = kodersFiltered.filter(koder =>koder.gender === gender) //gender no hay que parsearlo ya que ya es un string 
        }
    
    
    
        response.json({
            succes: true, //se agrega succes y data para arrojar info más descriptiva, generando ciertas nomenclaturas para enviar las respuestas
            data: {
                koders: kodersFiltered || json.koders
            }
        })
    })
    
    
    router.post('/', async (request, response) => { //para el post se utiliza request, se manda un paquete http (header y body)
        //request objeto que trae todo lo que nos mandan, request y response lo manejaremos en json 
        //Leer la dat del nuevo koder del body
        const newKoder = request.body //aquí recibo la info que escribi en insomnia
        console.log(newKoder);
    /*     console.log(request.headers); 
     */    //para el post se utiliza request, se manda un paquete http (header y body)
            //request objeto que trae todo lo que nos mandan, request y response lo manejaremos en json 
           
    
            const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8') //await va antes de la promesa
            const json = JSON.parse(dataFile)
        
            json.koders.push(newKoder)
    
            await fs.promises.writeFile('./kodemia.json', JSON.stringify(json, null, 2), 'utf8')
    
            response.json({
                succes: true,
                msg: 'Koder creado!'
            })
        })
        

        router.get('/:idKoder' ,async (request, response) => {
            console.log(request.params)
        
            const id = parseInt(request.params.idKoder)
            const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8') //await va antes de la promesa
            const json = JSON.parse(dataFile)
        
            const koderFound = json.koders.find(koder => koder.id === id) 
            if(!koderFound){
                response.status(404)
                response.json({
                    succes: false, 
                    msg: 'Koder no encontrado'
                })
                return
            }
            response.json({
                succes: true, 
                data: {
                    koder:koderFound
                }
            })
        })
        

       router.delete('/:idKoder', async (request, response) => {
            /* 
            0-. de donde lo quiero eliminar? archivo -> leer el archivo  fs.promise.readFile
            1-. que koder quiere eliminar? 
            2-. cual es el id del koder a eliminar? request.params.id
            3-. buscar al koder en lista y eliminar al koder -.filter(), .splice(), 
            4-. Actualizar al archivo sin el koder -> fs.promise.writeFile()
            5-. Responder
            */
            const dataFile = await fs.promises.readFile('kodemia.json', 'utf8')
            const json = JSON.parse(dataFile)
        
            //destructuring assigment -> para acceder a un objeto de forma más sencilla
            const { idKoder } = request.params // esto es igual a const id = request.params.idKoder
        
            const newKoders = json.koders.filter(koder => koder.id !== parseInt(idKoder))
        
            json.koders = newKoders //reemplazando a los nuevos koder sin el koder eliminado
        
            await fs.promises.writeFile('kodemia.json', JSON.stringify(json, null, 2), 'utf8')
        
            response.json({
                succes:true,
                msg: 'Koder eliminado'
            })
        })
        
        export default router 

     

        router.patch('/:idKoder', async (request, response) => {
            /* 
            0-. de donde lo quiero modificar? archivo -> leer el archivo  fs.promise.readFile
            1-. que koder quiero modificar? (pasando su id ),  request.params.id
            2-. Al koder con ese id que le quiero modificar 
            3-. buscar al koder en lista y modificar puede ser con ... 
            4-. Actualizar el archivo con el código modificado  -> fs.promise.writeFile()
            5-. Responder
            */
            const dataFile = await fs.promises.readFile('kodemia.json', 'utf8')
            const json = JSON.parse(dataFile)
        
            //destructuring assigment -> para acceder a un objeto de forma más sencilla
            const { idKoder } = request.params // esto es igual a const id = request.params.idKoder -> aqui recibo string solamente 
            console.log('id kode', idKoder);
        
            const koderFound = json.koders.find(koder => koder.id === parseInt(idKoder))  //sería igual == (idKoder) parseInt solo devuelve enteros si quiero decimal parseFloat
            console.log('koderFound: ', koderFound);
        
            const newData = {
                generation: 50
            }
        
            const koderUpdated = {...koderFound, ...newData}
            console.log(koderUpdated)
        
            const newKodersToUpdate = json.koders.filter(koder => koder.id !== parseInt(idKoder)) //idKoder es str ya que está en el archivo json 
            console.log(newKodersToUpdate);
        
            newKodersToUpdate.push(koderUpdated)
            json.koders = newKodersToUpdate
            console.log('Koder actualizado');
            console.log(json.koders);
        
            await fs.promises.writeFile('kodemia.json', JSON.stringify(json, null, 2), 'utf8') //mandamos y recibimos string 
        
            response.json({
                succes:true,
                msg: 'Koder modificado'
            })
        })
        
       
         
           /* 
        práctica
        Get /mentors 
        Post /mentors/:id
        Patch /mentors/:id
        Delete /mentors /:id

        Router para mentores, agregar a json varios mentores 
        */
