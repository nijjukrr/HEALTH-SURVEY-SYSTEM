const https = require('https');

https.get('https://ghoapi.azureedge.net/api/Indicator', (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const json = JSON.parse(data);
        const indicators = json.value;
        const keywords = ['cholera', 'diarrhoea', 'diarrhea', 'typhoid', 'water'];

        const matches = indicators.filter(ind =>
            keywords.some(kw => ind.IndicatorName.toLowerCase().includes(kw))
        );

        matches.forEach(m => console.log(`${m.IndicatorCode} : ${m.IndicatorName}`));
    });
}).on('error', (err) => {
    console.log("Error: " + err.message);
});
