const express = require("express");
const router = express.Router();
const checkAuthentication = require('../middleware/auth,js')

const {createContact,siginInContact,getContactById,deleteContactById,getAllContacts,updateContact} = require('../controllers/ContactController')

router.post("/signup",createContact );
router.post("/signin",siginInContact );
router.get("/:contactId",getContactById );
router.get("/",getAllContacts );
router.delete("/:contactId",deleteContactById );
router.patch("/:contactId", checkAuthentication,updateContact);


module.exports = router; 
