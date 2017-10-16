const express = require('express');
const propRouter = express.Router();
var js2xmlparser = require('js2xmlparser2');
const { getProperties } = require('../model/db');

const parserOptions = {
    wrapArray: {
        enabled: true
    }
};

const router = () => {


    propRouter.route('/props')
        .get(async (req, res) => {

            try {
                const props = await getProperties();
                if (req.accepts('xml')) {
                    res.send(js2xmlparser('properties', props, parserOptions));
                } else {
                    res.send(props);
                }
            } catch (error) {
                return error;
            }
        });

    return propRouter;
};


module.exports = router;