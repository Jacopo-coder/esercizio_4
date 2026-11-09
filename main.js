const express = require("express");
const app = express();
const port = 3000;

const recipes = require("./data.json");

app.get("/", (req, res) => {
    res.json({
        message: "Ricettario",
    });
});

app.get("/recipes", (req, res) => {
    
    let result = recipes;

    if (req.query.minPrepTime != undefined) {
        const minPrepTime = Number(req.query.minPrepTime);

        if (isNaN(minPrepTime) || minPrepTime <= 0) {
            res.status(400).json({
                success: false,
                error: "minpreptime deve essere numerico e positivo",
            });
        }

        result = recipes.filter((r) => {
            return r.prepTimeMinutes >= minPrepTime;
        });
    }   

    if (req.query.difficulty != undefined) {
        const difficulty = req.query.difficulty.toLowerCase();
        const allowedDifficulty = ["easy", "medium", "hard"]

        if (!allowedDifficulty.includes(difficulty)) {
            res.status(400).json({
                success: false,
                error: 'difficulty non valida',
            })
        }
        result = result.filter( r => {
            return r.difficulty.toLocaleLowerCase() === difficulty.toLocaleLowerCase()
        })
    }

    res.json(result);
});


app.get("/recipes/:id", (req, res) => {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
        res.status(400).json({
            success: false,
            error: "id deve essere numerico",
        });
    }

const recipe = recipes.find((r) => {
    return r.id === recipeId;
});

    if (!recipe) {
        res.status(404).json({
            success: false,
            error: "ricetta non trovata",
        });
    }    

    res.status(200).json({
        success: true,
        data: recipe,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
