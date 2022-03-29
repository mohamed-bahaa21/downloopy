import scrape from 'website-scraper'; // only as ESM, no CommonJS

route.get('/scrape', (req, res) => {

    let link = 'https://www.infoq.com/presentations/npm-install/?useSponsorshipSuggestions=true&itm_source=presentations_about_development&itm_medium=link&itm_campaign=development';
    const options = {
        urls: [link],
        directory: '/path/to/save/',
        sources: [
            { selector: 'img', attr: 'src' }
        ]
    };

    // with async/await
    // const result = await scrape(options);

    // with promise
    scrape(options).then((result) => {
        res.send(result)
    });
})