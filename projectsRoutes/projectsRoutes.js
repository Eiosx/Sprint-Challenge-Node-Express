const express = require('express');

const router = express.Router();

const projectModel = require('../data/helpers/projectModel');

router.get('/', (req, res) => {
    projectModel.get()
        .then(projects => {
            res.json(projects);
        })
        .catch(err => {
            res.json(500).json({ errorMessage: "There was an error getting the projects." })
        });
})

//Need to add handling for non-existent id. Could not solve this. Invalid ID goes straight to error handler but can't get message to show. 
router.get('/:id', (req, res) => {
    const { id } = req.params;
    projectModel.get(id)
        .then(project => {
            console.log('hello', project)
            res.json(project);
        })
        .catch(err => {
            res.json(500).json({ errorMessage: "There was an error getting the projects." })
        });
})

router.get('/:id/actions', (req, res) => {
    const { id } = req.params;
    projectModel.getProjectActions(id)
        .then(projectActions => {
            projectActions.length ? res.json(projectActions) : res.json({ message: "Project does not exist or has no actions." });
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Could not get project actions." });
        });
})

router.post('/', (req, res) => {
    const newProject = req.body;
    if (newProject.name && newProject.description) {
        projectModel.insert(newProject)
            .then(createdProject => {
                res.json(createdProject);
            })
            .catch(err => {
                res.status(500).json({ errorMessage: "There was an error creating project." });
            });
    } else {
        res.status(400).json({ message: "Please include name and description." });
    }
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const projectChanges = req.body;

    if (projectChanges.name || projectChanges.description || projectChanges.completed) {
        projectModel.update(id, projectChanges)
            .then(updatedProject => {
                updatedProject ? res.json(updatedProject) : res.status(400).json({ message: `Project with id: ${id}, does not exist.` });
            })
            .catch(err => {
                res.json(500).json({ errorMessage: "There was an error updating project." })
            });
    } else {
        res.status(400).json({ message: "Please include at least one of these fields: name, description, or completed." });
    }

})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    projectModel.get(id).then(project => {
        projectModel.remove(id)
            .then(countOfDeleted => {
                if (countOfDeleted) {
                    res.json(project);
                } else {
                    res.status(400).json({ message: `Project at id:${id}, does not exist. Can not delete.` });
                }
            })
            .catch(err => {
                res.status(500).json({ errorMessage: "Error trying to delete project" });
            });
    }).catch(err => {
        res.status(500).json({ errorMessage: "Error finding project." });
    });

})



module.exports = router;