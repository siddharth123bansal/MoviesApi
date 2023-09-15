const express = require("express");
const {prisma} = require("./connection");
const Joi = require('joi');
const app = express();
app.use(express.json())
const PORT = 3001 
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));
app.post('/movies/add', async (req, res) => {
  try {
    const movie = await prisma.movie.create({
      data: req.body,
    });
    res.send("Movie created successfully");
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(400).json({ error: "Failed to create the movie." });
  }
});
app.get("/", async (req, res) => {
    const users=await prisma.users.findMany({
        include:{
            subs:true
        }
    })
   if(users.length) return res.json(users)
   else return res.json("no user found")
})
const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().integer().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    type: Joi.number().integer().required(),
    profile: Joi.string(),
  });
  app.get('/movies', async (req, res) => {
    try {
      const movies = await prisma.movie.findMany({
        include: {
          directorData: {
            include:{
             director:true
            }
          }     
        },
      });
      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'An error occurred while fetching movies.' });
    }
  });
  app.get('/movies/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const movie = await prisma.movie.findFirst({
        where: {
          filmid: id,
        },
        include: {
          directorData: {
            include: {
              director: true,
            },
          },
        },
      });
      if (!movie) {
        res.status(404).json({ error: 'Movie not found.' });
        return;
      }
      res.json(movie);
    } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({ error: 'An error occurred while fetching the movie.' });
    }
  });
  app.put('/update/movie/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.movie.update({
        where: {
          filmid: id,
        },
        data: req.body,
      });
      res.send("Movie updated successfully")
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(400).json({ error: error.message || 'An error occurred while updating the movie.' });
    }
  });
  app.delete('/delete/movie/:id',async (req ,res)=>{
    const id= parseInt(req.params.id)
    try{
        await prisma.movie.delete({
            where:{filmid:id}
        })
        res.send("Movie deleted")
    }catch(err){
      res.status(400).send(err)
    }
  })
  app.get('/directors', async (req, res) => {
    try {
      const directors = await prisma.director.findMany()
      res.json(directors);
    } catch (error) {
      console.log(error)
    }
  })
app.post('/users/add',async (req,res)=>{
    try {
        // missing validation
        const err=schema.validate(req.body)
        if(err.Error){
            return res.status(400).send(err.Error)
        }
         await prisma.users.create({
          data: req.body,
        });
        res.send("User created successfully");
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).send(error);
      }
})
app.put('/users/update/:id', async (req, res) => {
    try {
      const existingUser = await prisma.users.findUnique({
        where: { userid: req.params.id },
      });
      if (!existingUser) {
        return res.status(404).send("User not found");
      }
      const updatedFields = {};
      if (req.body.name && req.body.name !== existingUser.name) {
        updatedFields.name = req.body.name;
      }
      if (req.body.phone && req.body.phone !== existingUser.phone) {
        updatedFields.phone = req.body.phone;
      }
      if (req.body.password && req.body.password !== existingUser.password) {
        updatedFields.password = req.body.password;
      }
      if (req.body.email && req.body.email !== existingUser.email) {
        updatedFields.email = req.body.email;
      }
      if (req.body.type && req.body.type !== existingUser.type) {
        updatedFields.type = req.body.type;
      }
      if (req.body.profile && req.body.profile !== existingUser.profile) {
        updatedFields.profile = req.body.profile;
      }
      if (Object.keys(updatedFields).length === 0) {
        return res.send("No changes to update");
      }
      await prisma.users.update({
        where: { userid: req.params.id },
        data: updatedFields,
      });
      res.send("User Updated");
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).send(error);
    }
  });
  
//   route name should be more detail oriented 
  app.delete('/users/deleteuser/:id',async (req,res)=>{
    try{
        const delt=await prisma.users.delete({
        where:{userid:parseInt(req.params.id)}
    })
    res.send("User deleted")
}catch(err){
    res.status(400).send(err)
    }
})
app.post('/users/subscription/:id', async (req, res) => {
    const id=parseInt(req.params.id)
    try {
      
        // implement destructure in proper way with error handling as discussed
        const addFields={}
        addFields.userid=id
        if(!req.body.name ){
            return res.status(400).send("Enter valid name")
        }else{
            addFields.name=req.body.name
        }
        if(!req.body.price ){
            return res.status(400).send("Enter valid price")
        }else{
            addFields.price=req.body.price
        }
        if(!req.body.duration){
            return res.status(400).send("Enter valid duration")
        }else{
            addFields.duration=req.body.duration
        }
        if(Object.keys(addFields).length===0){return res.send("Add all fields")}
      await prisma.subscription.create({
        data: addFields,
      });
      res.send("Subscription created successfully");
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(400).send(error.message || "An error occurred");
    }
  });
  app.get('/getsubs/:id',async (req,res)=>{
    try{
        const data=await prisma.subscription.findMany({
            where:{userid:parseInt(req.params.id)}
        })
        res.send(data)
    }catch(err){
        res.status(400).send(err)
    }
  })
  app.put('/updateplan/:id',async (req,res)=>{
    try{
        const { name, price, duration } = req.body;
        await prisma.subscription.update({
            where:{id:parseInt(req.params.id)},
            data:{
                name,
                price,
                duration
            }
        })
        res.send("data updated")
    }catch(err){
        res.status(400).send(err)
    }
  })
  app.delete('/delplan/:id',async (req,res)=>{
    try{
        await prisma.subscription.delete({
            where:{id:parseInt(req.params.id)},
        })
        res.send("data deleted")
    }catch(err){
        res.status(400).send(err)
    }
  })
  app.listen(PORT,()=> console.log(`server started on port ${PORT}`));