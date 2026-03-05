var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data')
let { GenID, getItemById } = require('../utils/idHandler')

/* GET roles listing. */
router.get('/', function (req, res, next) {
    let result = dataRole.filter(
        function (e) {
            return !e.isDeleted;
        }
    )
    res.send(result);
});

router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.filter(
        function (e) {
            return e.id == id && !e.isDeleted;
        }
    )
    if (result.length) {
        res.send(result[0])
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        })
    }
});

router.post('/', function (req, res) {
    let newRole = {
        id: GenID(dataRole),
        name: req.body.name,
        description: req.body.description,
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    }
    dataRole.push(newRole);
    res.send(newRole)
})

router.put('/:id', function (req, res) {
    let id = req.params.id;
    let result = dataRole.filter(
        function (e) {
            return e.id == id && !e.isDeleted;
        }
    )
    if (result.length) {
        result = result[0];
        let keys = Object.keys(req.body);
        for (const key of keys) {
            if (result[key]) {
                result[key] = req.body[key]
            }
        }
        result.updatedAt = new Date(Date.now())
        res.send(result)
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        })
    }
})

router.delete('/:id', function (req, res) {
    let id = req.params.id;
    let result = dataRole.filter(
        function (e) {
            return e.id == id && !e.isDeleted;
        }
    )
    if (result.length) {
        result = result[0];
        result.isDeleted = true;
        result.updatedAt = new Date(Date.now())
        res.send(result)
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        })
    }
})

// Get all users in a role
router.get('/:id/users', function (req, res) {
    let id = req.params.id;
    let role = dataRole.find(r => r.id == id && !r.isDeleted);
    if (!role) {
        res.status(404).send({
            message: "ROLE ID NOT FOUND"
        })
        return;
    }
    let users = dataUser.filter(u => u.role.id == id && !u.isDeleted);
    res.send(users);
});

module.exports = router;