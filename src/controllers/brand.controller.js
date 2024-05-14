const Brand = require("../models/brand.model");
const Io = require("../utils/io");
const Joi = require("joi");
const path = require("path");

const brandsDB = new Io(`${process.cwd()}/database/brands.json`);

const getBrands = async (req, res) => {

    const brands = brandsDB.read();

    res.json({message: "Success", data: brands});
}

const createBrand = async (req, res) => {
    const brands = brandsDB.read();
    const {name} = req.body;
    const {photo} = req.files;

    const schema = Joi.object({
        name: Joi.string().required(),
        photo: Joi.required()
    })

    const {error} = schema.validate({name, photo});

    if(error) return res.status(400).json({message: error.message})
    const photoName = `${uuid()}${path.extname(photo.name)}`;
    photo.mv(`${process.cwd()}/uploads/${photo.name}`);    

    const newBrand = new Brand(name, photo);

    brands.push(newBrand);
    brandsDB.write(brands);
    res.status(201).json({message: "Success", data: newBrand});
    
}   

module.exports = {
    getBrands,
    createBrand
}