const express = require('express');
const http = require('http')





// *** express server initialization ***
const app = express();

// getting  third party  and api middlewares and routes 
require('./routes/index')(app);
require('./routes/db')();






app.listen(process.env.PORT || 5000, () => {
    console.log('server is listening in port 5000')
}) 