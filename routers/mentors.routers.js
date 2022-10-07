import express from 'express'
import fs from 'fs'

const router = express.Router()



    router.get('/', async (request, response) => { 
        const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8')
        const json = JSON.parse(dataFile)
        let mentors = json.mentors
    
        const queries = request.query
        console.log(queries);
    
        const {generation, gender} = request.query
        console.log('generation: ', generation);
    
        let mentorsFiltered = json.mentors;
       
        if(generation){
            mentorsFiltered = mentorsFiltered.filter(mentor => mentor.generation === parseInt(generation))
        }
        if(gender){
            mentorsFiltered = mentorsFiltered.filter(mentor =>mentor.gender === gender)  
        }
    
    
    
        response.json({
            succes: true, 
            data: {
                mentors: mentorsFiltered || json.mentors
            }
        })
    })
    
    
    router.post('/', async (request, response) => { 
        
        const newmentor = request.body 
        console.log(newmentor);
    
           
    
            const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8') 
            const json = JSON.parse(dataFile)
        
            json.mentors.push(newmentor)
    
            await fs.promises.writeFile('./kodemia.json', JSON.stringify(json, null, 2), 'utf8')
    
            response.json({
                succes: true,
                msg: 'mentor creado!'
            })
        })
        

        router.get('/:idMentor' ,async (request, response) => {
            console.log(request.params)
        
            const id = parseInt(request.params.idMentor)
            const dataFile = await fs.promises.readFile('./kodemia.json', 'utf8') 
            const json = JSON.parse(dataFile)
        
            const mentorFound = json.mentors.find(mentor => mentor.id === id) 
            if(!mentorFound){
                response.status(404)
                response.json({
                    succes: false, 
                    msg: 'mentor no encontrado'
                })
                return
            }
            response.json({
                succes: true, 
                data: {
                    mentor:mentorFound
                }
            })
        })
        

       router.delete('/:idMentor', async (request, response) => {
            const dataFile = await fs.promises.readFile('kodemia.json', 'utf8')
            const json = JSON.parse(dataFile)
        
            const { idMentor } = request.params // esto es igual a const id = request.params.idMentor
        
            const newmentors = json.mentors.filter(mentor => mentor.id !== parseInt(idMentor))
        
            json.mentors = newmentors 
        
            await fs.promises.writeFile('kodemia.json', JSON.stringify(json, null, 2), 'utf8')
        
            response.json({
                succes:true,
                msg: 'mentor eliminado'
            })
        })

        router.patch('/:idMentor', async (request, response) => {
            
            const dataFile = await fs.promises.readFile('kodemia.json', 'utf8')
            const json = JSON.parse(dataFile)
        
            //destructuring assigment -> para acceder a un objeto de forma más sencilla
            const { idMentor } = request.params // esto es igual a const id = request.params.idMentor -> aqui recibo string solamente 
            console.log('id mentor', idMentor);
        
         

            const mentorFound = json.mentors.find(mentor => mentor.id === parseInt(idMentor))  //sería igual == (idMentor) parseInt solo devuelve enteros si quiero decimal parseFloat
            console.log('mentorFound: ', mentorFound);
        
            const newData = {
                generation: 50
            }
        
            const mentorUpdated = {...mentorFound, ...newData}
            console.log(mentorUpdated)
        
            const newmentorsToUpdate = json.mentors.filter(mentor => mentor.id !== parseInt(idMentor)) //idMentor es str ya que está en el archivo json 
            console.log(newmentorsToUpdate);
        
            newmentorsToUpdate.push(mentorUpdated)
            json.mentors = newmentorsToUpdate
            console.log('mentor actualizado');
            console.log(json.mentors);
        
            await fs.promises.writeFile('kodemia.json', JSON.stringify(json, null, 2), 'utf8') //mandamos y recibimos string 
        
            response.json({
                succes:true,
                msg: 'mentor modificado'
            })
        })
        
       
        
        export default router 