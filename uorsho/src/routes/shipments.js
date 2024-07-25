import {Router} from "express";
import {promises as fs} from 'node:fs';
import { fileURLToPath } from "node:url";
import path from "node:path";

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename)

const routerShipments = Router();
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

//Get all shipments
routerShipments.get('/', async (req, res) => {
    const data = await readsDataBase();
    res.json(data.shipments)
})

//Get shipment by id
routerShipments.get('/:id', async (req, res) => {
    const data = await readsDataBase();
    const foundShipments = data.shipments.find(_warehouse => _warehouse.id === parseInt(req.params.id));

    if(!foundShipments){
        return res.status(404).json({ message: "Pedido no encontrado."})
    }

    res.json(foundShipments)
})

//Create a new shipment 
routerShipments.post('/', async (req, res) => {
    const data = await readsDataBase();
    const foundWarehouse = data.warehouses.find(warehouse => warehouse.id === parseInt(req.body.wharehouseId))
    
    if(!foundWarehouse){
        return res.status(404).json({ message: "Id del almacen no encontrado"})
    }

    const newShipments = {
       id: data.shipments.length + 1,
       item: req.body.item,
       quantity: req.body.quantity,
       warehouseId: foundWarehouse
    };

    data.shipments.push(newShipments);
    await writeData(data);

    res.status(201).json({ message: "Pedido creado exitosamente", shipment: newShipments})
})

//Update shipment
routerShipments.put('/:id', async (req, res) => {
    const data = await readsDataBase();
    const dataIndex = data.shipments.findIndex(shipments => shipments.id === parseInt(req.params.id))

    if(dataIndex === -1){
        return res.status(404).json({ message: "Pedido no encontrado"})
    }

    const updateWarehouse = {
        ...data.shipments[dataIndex],
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: data.shipments[dataIndex].warehouseId
    }

    data.warehouses[dataIndex] = updateWarehouse;
    await writeData(data)

    res.json({ message: "Pedido actualizado exitosamente", warehouses: updateWarehouse})
})

//Delete shipment
routerShipments.delete('/:id', async (req, res) => {
    const data = await readsDataBase();
    const newData = data.shipments.filter(shipments => shipments.id !== parseInt(req.params.id, 10));

    if(data.length === newData.length){
        return res.status(404).json({ message: "Pedido no encontrado"})
    }

    data.shipments = newData;
    await writeData(data)

    res.json({ message: "Pedido eliminado exitosamente"})
})

export default routerShipments