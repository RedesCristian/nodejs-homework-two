const express = require('express')
const {updateStatusContact} = require('../../models/contacts')
const router = express.Router()
const{listContacts, getContactById, removeContact, addContact, updateContact} = require("../../models/contacts")
const Joi = require("joi");


const contactSchema = Joi.object({
  name: Joi.string().required(),
  email:Joi.string().email().required(),
  phone: Joi.string().required(),
});


router.get('/', async (req, res, next) => {

  try{
    const contacts = await listContacts();
    res.status(200).json(contacts);
  }catch(error){
    next(error);
  }
});



router.get('/:contactId', async (req, res, next) => {
const {contactId} = req.params;
try{
  const contact = await getContactById(contactId);
if(contact){
  res.status(200).json(contact);
}else{
  res.status(404).json({message:"Not found"});
}
}catch(error){
  next (error);
}
});



router.post('/', async (req, res, next) => {
  const {error} = contactSchema.validate(req.body);
if (error){
  res.status(400).json({ message: error.details[0].message });

}
  try{
  const newContact = await addContact(req.body);
  return res.status(201).json(newContact)
}catch(error){
  next(error);
}
 
})

router.delete('/:contactId', async (req, res, next) => {
const {contactId}= req.params;
try{
  const wasRemoved = await removeContact(contactId);
  if(wasRemoved){
    res.status(200).json({message:"contact deleted"});
  }else{
    res.status(404).json({message:"Not found"});
  }
}catch(error){
  next(error);
}
  
});




router.put('/:contactId', async (req, res, next) => {
  const {contactId}=req.params;
  const {error} = contactSchema.validate(req.body);
  if(error){
    return res.status(400).json({message:"missing fields"});
  }
  try{
    const updatedContact = await updateContact(contactId, req.body);
    if(updatedContact){
      res.status(200).json(updateContact);
    }else{
      res.status(404).json({message:"Not found"});
    }
  }catch(error){
    next(error)
  }
});

router.patch('/:contactId', async( req, res, next ) =>{
  const {contactId} = req.params;
  const {favorite} = req.body;
  if(favorite===undefined){
    return res.status(400).json({message:"missing field favorite" })
  }
try{
  const newUpdatedContact = await updateStatusContact(contactId,{favorite});
  if (!newUpdatedContact){
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json(newUpdatedContact);
}catch(error){

  next(error);
}

})

module.exports = router;
