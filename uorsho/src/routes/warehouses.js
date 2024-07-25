import {Router} from "express";
import {promises as fs} from 'node:fs';
import { fileURLToPath } from "node:url";
import path from "node:path";

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename)

const routerWarehouse = Router();
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

//Get all warehouse
routerWarehouse.get('/', async (req, res) => {
    const data = await readsDataBase();
    res.json(data.warehouses)
})

//Get warehouse by id
routerWarehouse.get('/:id', async (req, res) => {
    const data = await readsDataBase();
    const foundWarehouse = data.warehouses.find(_warehouse => _warehouse.id === parseInt(req.params.id));

    if(!foundWarehouse){
        return res.status(404).json({ message: "Almacen no encontrado."})
    }

    res.json(foundWarehouse)
})

//Create a new warehouse 
routerWarehouse.post('/', async (req, res) => {
    const data = await readsDataBase();
    const newWarehouse = {
       id: data.warehouses.length + 1,
       name: req.body.name,
       location: req.body.location,
       shipmentsId : [],
       driversId: [],
       vehiclesId: []
    };

    data.warehouses.push(newWarehouse);
    await writeData(data);

    res.status(201).json({ message: "Almacen creado exitosamente", warehouse: newWarehouse})
})

//Update warehouses
routerWarehouse.put('/:id', async (req, res) => {
    const data = await readsDataBase();
    const dataIndex = data.warehouses.findIndex(warehouse => warehouse.id === parseInt(req.params.id))

    if(dataIndex === -1){
        return res.status(404).json({ message: "Almacen no encontrado"})
    }

    const updateWarehouse = {
        ...data.warehouses[dataIndex],
        name: req.body.name,
        location: req.body.location
    }

    data.warehouses[dataIndex] = updateWarehouse;
    await writeData(data)

    res.json({ message: "Almacen actualizado exitosamente", warehouses: updateWarehouse})

})

//Delete wharehouse
routerWarehouse.delete('/:id', async (req, res) => {
    const data = await readsDataBase();
    const newData = data.warehouses.filter(warehouse => warehouse.id !== parseInt(req.params.id, 10));

    if(data.length === newData.length){
        return res.status(404).json({ message: "Almacen no encontrado"})
    }

    data.warehouses = newData;
    await writeData(data)

    res.json({ message: "Almacen eliminado exitosamente"})
})

export default routerWarehouse