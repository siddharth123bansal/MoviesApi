const express = require("express");
const {prisma} = require("./connection");
const app = express();
app.use(express.json())
const PORT = 3000
app.get("/", async (req, res) => {
    const users=await prisma.users.findMany({
        include:{
            subs:true
        }
    })
   if(users.length) return res.json(users)
   else return res.json([])
})
app.post('/users/add',async (req,res)=>{
    try {
        // missing validation
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
        if(!req.body.name ){
            return res.status(400).send("Enter valid name")
        }
        if(!req.body.price ){
            return res.status(400).send("Enter valid price")
        }
        if(!req.body.duration){
            return res.status(400).send("Enter valid duration")
        }
      const { name, price, duration } = req.body;
      if (!name || !price || !userid || !duration) {
        throw new Error("Missing required fields");
      }
      await prisma.subscription.create({
        data: {
          name,
          price,
          id,
          duration,
        },
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
