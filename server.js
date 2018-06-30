const express = require('express');
const app = express();
const port = process.env.PORT || 8080
app.use(express.static('public'));
app.listen(port, () => console.log(`Your app is listening on port ${port}`));