const fs = require('fs');

fs.readFile('reviser.json', (err, data)=>{
    if(err){
        console.error('failed to read file')
    }
    try {
        const Json = JSON.parse(data);
        Json.map(x=>{
            x.word;
        });
        console.log(Json.length);
        
    } catch (error) {
        console.error("failed to load file ", error)
        
    }
} )