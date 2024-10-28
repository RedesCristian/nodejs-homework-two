const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      }
});

const Contact = mongoose.model('Contact', contactSchema);



// Functie pentru listarea contactelor
const listContacts = async () => {
  return await Contact.find();
};



// Functie pentru a primi un contact dupa id

const getContactById = async (contactId) => {
    try{
        
            const contact = await Contact.findById(contactId);
        if(!contact){
            throw new Error(`Contact with id ${contactId} not found`);
           }
           return contact;

    }catch(error){
        throw new Error(`Error finding contact: ${error.message}`);

    }


}


// functie pentru inlaturarea unui contact

const removeContact = async (contactId) => {
    const deletedContacts = await Contact.findByIdAndDelete(contactId);
if(!deletedContacts){
    return null;
}
return deletedContacts;
};


// Functie pentru a adauga un contact nou


const addContact = async (body) => {
    const{name, email, phone} = body;
    const newContact = {
        id: uuidv4(),
        name,
        email,
        phone,
    };

 const contact = newContact(body);
 try{
    const savedContact = await contact.save();
    return savedContact;
 }catch(error){
    throw new Error(`Error adding contact: ${error.message}`);
 }
};


// Functie pentru a updata un contact


const updateContact = async (contactId, body) => {

    try
    {  const updatedContacts = await Contact.findByIdAndUpdate(contactId, body, {new:true, runValidators:true});
    
    if (!updatedContacts) {
        return null; // Dacă contactul nu a fost găsit
    }
return updatedContacts;
}catch(error){
    throw new Error(`Error updating contact: ${error.message}`);
}
  
};

// functia verificare pentru favorite

const updateStatusContact = async (contactId, body) =>{
try{
    const newUpdatedContact = await Contact.findByIdAndUpdate(contactId, body, {new:true, runValidators:true});
    return newUpdatedContact;

}catch(error){
    throw new Error(`Error updating contact status: ${error.message}`);
}

};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
