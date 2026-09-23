const http = require('http');

const PORT = 3000;

http.createServer(function (req,res) {
   res.write("On my way!");
   res.end();
}).listen(PORT);

console.log(`Server start on port ${PORT}`)
