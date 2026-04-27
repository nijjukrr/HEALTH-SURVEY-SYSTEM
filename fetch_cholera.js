const https = require('https');

https.get('https://ghoapi.azureedge.net/api/CHOLERA_0000000001?$top=5', (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Error parsing JSON:", e.message);
            console.log("Raw Response:");
            console.log(data.substring(0, 500));
        }
    });
}).on('error', (err) => {
    console.log("Error: " + err.message);
});
