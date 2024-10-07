 const fs = require('fs/promises')
const { v4: uuidv4 } = require('uuid');
const path= require("path");
const contactsPath = path.join(__dirname, "contacts.json");

// Functie pentru listarea contactelor
const listContacts = async () => {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        const objectJson = JSON.parse(data);
        return objectJson; // Returnăm lista contactelor
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
};



// Functie pentru a primi un contact dupa id

const getContactById = async (contactId) => {
 const contacts = await listContacts();
 const contact = contacts.find(contact =>contact.id===contactId);
 return contact || null;
};



// functie pentru inlaturarea unui contact

const removeContact = async (contactId) => {
    const contacts = await listContacts();
    const updateContacts = contacts.filter(contact => contact.id !== contactId);
    
    if (contacts.length === updateContacts.length) {
        return null; // Dacă lungimea este aceeași, contactul nu a fost găsit
    }

    await fs.writeFile(contactsPath, JSON.stringify(updateContacts, null, 2));
    return true;
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

    const contacts = await listContacts();
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
return newContact;
};


// Functie pentru a updata un contact


const updateContact = async (contactId, body) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    
    if (index === -1) {
        return null; // Dacă contactul nu a fost găsit
    }

    contacts[index] = { ...contacts[index], ...body }; // Actualizează contactul cu noile date
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
};


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
