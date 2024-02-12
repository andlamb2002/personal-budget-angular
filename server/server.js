// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs'); // File system


app.use(cors());

app.use("/", express.static('public'));

const budgetData = JSON.parse(fs.readFileSync('budget-data.json')); // Read and parse the budget data

// const budget = {
//     myBudget: [
//         {
//             title: 'Eat out',
//             budget: 25
//         },
//         {
//             title: 'Rent',
//             budget: 275
//         },
//         {
//             title: 'Grocery',
//             budget: 110
//         },
//     ]
// };

app.get('/budget', (req, res) => {
    res.json(budgetData);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});