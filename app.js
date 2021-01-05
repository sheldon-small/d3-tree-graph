
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/view/index.html'));
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
