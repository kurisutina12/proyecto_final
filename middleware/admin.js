module.exports = (req, res, next) => {

    if (req.userData.role !== 'ADMIN') {

        return res.status(403).send({
            message: 'No autorizado'
        });
    }

    next();
};