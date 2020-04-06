const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const youtubedl = require('youtube-dl');
const cors = require('cors');

const app = express();
app.use(cors());
app.get('/:texto', async function(req, res) {
    var lista = [];
    const text = req.params.texto;
    const response = await axios.get(`https://www.youtube.com/results?search_query=${text}`);
    const data = cheerio.load(response.data);
    const listaVideos = data('.yt-lockup-content');
    listaVideos.each((i, elem) => {
        const title = data(elem).find('.yt-uix-tile-link').text().trim();
        if (!title) return;
        const url = 'https://www.youtube.com' + data(elem).find('.yt-uix-tile-link').attr('href');
        const channel = data(elem).find('.yt-lockup-byline').children('a').text().trim();
        const img = data(elem).find('.yt-uix-tile-link').attr('href').substring(9, 20);
        const img_url = `http://img.youtube.com/vi/${img}/hqdefault.jpg`;
        const download = 'http://localhost:3000/download/' + img
        lista.push({ title: title, url: url, channel: channel, img: img_url, download: download });
    });
    const listaa = lista.filter(item => {
        return !item.url.includes('start_radio') && !item.url.includes('channel') && !item.url.includes('user')
    });
    res.send(listaa)

});
app.get('/download/:url', async function(req, res) {
    const url = req.params.url;
    const video = youtubedl(`https://www.youtube.com/watch?v=${url}`, ['--format=18'], { cwd: __dirname })
    video.on('info', function(info) {
        var name = info.title.trim();
        var x = name.replace(/\s/g, '');
        res.setHeader('Content-disposition', 'attachment; filename=' + x + '.mp3');
        video.pipe(res);
    })
});

app.listen(3000, () => {
    console.log('Servidor funcionando...')
});