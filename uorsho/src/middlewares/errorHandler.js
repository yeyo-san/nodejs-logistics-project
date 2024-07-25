const errorHandler = (err, req, res, next) =>{
    console.log(err.stack);
    res.status(500).json({ message: "Ocurrio un error en el servidor"})
};

export default errorHandler;