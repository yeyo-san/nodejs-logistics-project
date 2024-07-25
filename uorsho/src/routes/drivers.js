import {Router} from "express";
import {promises as fs} from 'node:fs';
import { fileURLToPath } from "node:url";
import path from "node:path";

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename)

const routerDrivers = Router();
const dataBase = path.join(__dirname, "../../server/db.json");

const readsDataBase = async () => {
    try {
        const data = await fs.readFile(dataBase, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer la base de datos: ${error.message}`);
    }
};

const writeData = async (data) =>{
    await fs.writeFile(dataBase, JSON.stringify(data, null, 2), "utf-8");
};

//Start to operetion CRUD

//Get all drivers
routerDrivers.get('/', async (req, res) =>{
    const data = await readsDataBase()
    res.json(data.drives);
})

//Create a new driver 
routerDrivers.post('/', async (req, res) => {
    const data = await readsDataBase();
    const newDrivers = {
       id: data.drivers.length + 1,
       name: req.body.name,
    };

    data.drivers.push(newDrivers);
    await writeData(data);

    res.status(201).json({ message: "Conductor creado exitosamente", Drivers: newDrivers})
})