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

//Need to add handling for non-existent id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    projectModel.get(id)
        .then(project => {
            res.json(project);
        })
        .catch(err => {
            res.json(500).json({ errorMessage: "There was an error getting the projects." })
        });
})

//Need to add handling if project has no actions or id is invalid
router.get('/:id/actions', (req, res) => {
    const { id } = req.params;
    projectModel.getProjectActions(id)
    .then(projectActions => {
        res.json(projectActions);
    })
    .catch(err => {
        res.status(500).json({errorMessage: "Could not get project actions."});
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

//Need to add code to return deleted obj instead of count of deleted and handle invalid id
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    projectModel.remove(id)
    .then(countOfDeleted => {
        res.json(countOfDeleted);
    })
    .catch(err => {
        res.status(500).json({errorMessage: "Error trying to delete project"});
    });
})



module.exports = router;