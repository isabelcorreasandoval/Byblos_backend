const adminAuth = (req, res, next) => {
    const claveHeader = req.headers['x-admin-key'];

    if (claveHeader === process.env.ADMIN_SECRET_KEY) {
        next(); 
    } else {
        res.status(401).json({ message: "No autorizado. Solo la encargada puede hacer esto." });
    }
};

module.exports = { adminAuth };