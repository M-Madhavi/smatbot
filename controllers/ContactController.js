const Contact = require('../models/Contact')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.createContact = (req, res, next) => {
    Contact.find({ email: req.body.email })
        .exec()
        .then(contact => {
            if (contact.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const contact = new Contact({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            first_name:  req.body.first_name,
                            last_name:req.body.last_name,
                            mobile_number:req.body.mobile_number,
                            createdAt: new Date().toISOString()

                        });
                        contact
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "contact created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

exports.siginInContact=(req, res, next) => {
        Contact.find({ email: req.body.email })
            .exec()
            .then(contact => {
                if (contact.length < 1) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                bcrypt.compare(req.body.password, contact[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: contact[0].email,
                                contact: contact[0]._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                        );
                        return res.status(200).json({
                            message: "Auth successful",
                            token: token
                        });
                    }
                    res.status(401).json({
                        message: "Auth failed"
                    });
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
    exports.getContactById = (req, res, next) => {
            const id = req.params.contactId;
            Contact.findById(id)
                .select('_id first_name last_name email  createdAt')
                .exec()
                .then(doc => {
                    if (doc) {
                        res.status(200).json({
                            contact: doc,
                        });
                    } else {
                        res.status(404).json({
                             message: "No valid entry found for provided ID" 
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        }
exports.deleteContactById = (req, res, next) => {
        Contact.remove({ _id: req.params.contactId })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Contact deleted"
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
    exports.getAllContacts =  (req, res, next) => {
            Contact.find()
                .select('_id first_name last_name email mobile_number createdAt')
                .exec()
                .then(docs => {
                    const response = {
                        count: docs.length,
                        contacts: docs.map(doc => {
                            return {
                                first_name:doc.first_name,
                                last_name: doc.last_name,
                                email: doc.email,
                                createdAt: doc.createdAt,
                                mobile_number: doc.mobile_number,
                                _id: doc._id,
                            };
                        })
                    };
                    res.status(200).json(response);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }

     exports.updateContact = (req, res, next) => {
            const id = req.params.contactId;
            Contact.updateMany({ _id: id }, { $set: {email: req.body.email, mobile_number: req.body.mobile_number } })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'contact updated',
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }