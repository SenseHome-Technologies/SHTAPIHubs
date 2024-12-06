'use strict';
const divisionInteractorPostgres = require('../../usecases/division/divisionInteractorPostgres');
const { divisionCreatePersistence } = require('../../usecases/division/divisionCreatePersistence');
const divisionGetPersistence = require('../../usecases/division/divisionGetPersistence');
const { divisionEditPersistence } = require('../../usecases/division/divisionEditPersistence');
const { divisionDeletePersistence } = require('../../usecases/division/divisionDeletePersistence');
const router = require('express').Router();

/**
 * @api {post} /api/division/create Create a division
 * @apiName CreateDivision
 * @apiGroup Division
 * @apiDescription Create a division
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} name The name of the division
 * @apiParam {String} icon The icon of the division
 *
 * @apiSuccess {Object} division The division
 * @apiSuccess {Number} division.status The status of the division
 * @apiSuccess {String} division.message The message of the division
 */
router.route('/division/create').post(
    async (req, res) => {
        const token = req.headers['token'];
        const { name, icon } = req.body;

        try {
            const division = await divisionInteractorPostgres.create({ divisionCreatePersistence }, { token, name, icon });
            res.status(division.status).send(division);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

/**
 * @api {get} /api/division/get Get a division
 * @apiName GetDivision
 * @apiGroup Division
 * @apiDescription Retrieve a division by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the division to retrieve
 *
 * @apiSuccess {Object} division The division
 * @apiSuccess {Number} division.status The status of the division
 * @apiSuccess {String} division.message The message of the division
 */
router.route('/division/get').get(
    async (req, res) => {
        const token = req.headers['token'];
        const { id } = req.body;

        try {
            const division = await divisionInteractorPostgres.get({ divisionGetPersistence }, { token, hubId });
            res.status(division.status).send(division);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

/**
 * @api {put} /api/division/edit Edit a division
 * @apiName EditDivision
 * @apiGroup Division
 * @apiDescription Edit a division by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the division to edit
 * @apiParam {String} name The name of the division
 * @apiParam {String} icon The icon of the division
 *
 * @apiSuccess {Object} division The division
 * @apiSuccess {Number} division.status The status of the division
 * @apiSuccess {String} division.message The message of the division
 */
router.route('/division/edit').put(
    async (req, res) => {
        const token = req.headers['token'];
        const { id, name, icon } = req.body;

        try {
            const division = await divisionInteractorPostgres.edit({ divisionEditPersistence }, { token, id, name, icon });
            res.status(division.status).send(division);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

/**
 * @api {delete} /api/division/delete Delete a division
 * @apiName DeleteDivision
 * @apiGroup Division
 * @apiDescription Delete a division by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the division to delete
 *
 * @apiSuccess {Object} division The division
 * @apiSuccess {Number} division.status The status of the division
 * @apiSuccess {String} division.message The message of the division
 */
router.route('/division/delete').delete(
    async (req, res) => {
        const token = req.headers['token'];
        const { name } = req.body;

        try {
            const division = await divisionInteractorPostgres.delete({ divisionDeletePersistence }, { token, name });
            res.status(division.status).send(division);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

module.exports = router;
