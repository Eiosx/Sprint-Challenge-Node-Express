const express = require('express');

const router = express.Router();

const actionModel = require('../data/helpers/actionModel');

router.get('/', (req, res) => {
    actionModel.get()
        .then(actions => {
            res.json(actions);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Could not get actions." });
        });
})

router.get('/:id', (req, res) => {
    const { id } = req.params;

    actionModel.get(id)
        .then(action => {
            res.json(action);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: `Could not get action at id:${id}.` });
        });
})

router.post('/', (req, res) => {
    const newAction = req.body;
    if (newAction['project_id'] && newAction.description && newAction.notes) {
        actionModel.insert(newAction)
            .then(createdAction => {
                res.json(createdAction);
            })
            .catch(err => {
                res.status(500).json({ errorMessage: "Could not create project." });
            });
    } else {
        res.status(400).json({ message: 'Please provide: project id, description, and notes' });
    }

})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const actionChanges = req.body;
    if (actionChanges['project_id'] || actionChanges.description || actionChanges.notes || actionChanges.completed) {
        actionModel.update(id, actionChanges)
            .then(updatedAction => {
                updatedAction ? res.json(updatedAction) : res.status(400).json({ message: `Action with id:${id} does not exist.` });
            })
            .catch(err => {
                res.status(500).json({ message: "Could not update action" });
            });
    } else {
        res.status(400).json({ message: "Please include at least of these fields: project_id, description, notes, or completed." });
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    actionModel.remove(id)
        .then(countOfDeleted => {
            countOfDeleted ? res.json(countOfDeleted) : res.status(400).json({ message: `Action at id:${id}, does not exist.` });
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Could not delete action." });
        });
})

module.exports = router;