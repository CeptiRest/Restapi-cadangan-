require('../set')
__path = process.cwd()

// Created by: Danzz Coding | danzzcodingweb.vercel.app

// Module
var express = require('express');
var router  = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var translate = require('translate-google-api');
var isUrl = require('is-url');
var TinyUrl = require('tinyurl');
var BitlyClient = require('bitly').BitlyClient

// Lib
var danzz = require("../lib/listapi");
var { fetchJson, runtime, getBuffer } = require('../lib/myfunc');
var { Gempa } = require('../lib/api/gempa.js');
var { XeonBotIncWiki } = require('../lib/api/xeonywiki.js');
var { Searchnabi } = require('../lib/api/kisahnabi.js');
var { mediafireDl } = require('../lib/api/mediafire.js');

// Apikey
var listkey = ["91y1a7l8a6","9286c1a775","9267ic6a0f1","927j59de9c","921n567ea6","921h5a4282","925n2c494","928b0323c9","927b0k3hp7o2","925b04ib0j","023l1qhbpk","92b1a0h7ts","92a70b789c","9291a7bk0p1","92a7o8pe9c","92y1a7l0a6","9221a7i9h2","921a7k3n94","92a0kk2bc9","921a7l9pho2","92a2n1kb0j","92b0a75k6f","92u1a7pr8s"];
var listkeyprem = ["Belilur"];


// Features
// Downloader
router.get('/downloader/ytplay', async (req, res, next) => {
	var apikey = req.query.apikey
	var query = req.query.query
	if (!query ) return res.json(loghandler.notquery) 

	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
	let yts = require("yt-search")
	let search = await yts(query)
	let anu = search.videos[Math.floor(Math.random() * search.videos.length)]

	let { yta, ytv } = require('../lib/api/y2mate')
	let mp3 = await yta(anu.url, '320kbps')
	let mp4 = await ytv(anu.url, '360p')
		res.json({
			status: true,
			creator: `${creator}`,
			result: {
				Link: anu.url,
				Title: anu.title,
				Description : anu.description,
				Idvideo: anu.videoId,
				Duration: anu.timestamp,
				Viewer: anu.views,
				UploadedOn : anu.ago,
				Author : anu.author.name,
				Channel : anu.author.url,
				linkdl: {
					mp3: mp3.dl_link,
					mp4:{ 
						link: mp4.dl_link,
						filesize: mp4.filesizeF
					}
				}

	} })
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/download/mediafire', async(req, res, next) => {
	var url = req.query.url,
		Apikey = req.query.apikey;

		if (!Apikey) return res.json(loghandler.notparam)
		if (listkey.includes(Apikey)){
		mediafireDl(url)
		.then(result => {
			res.json({
				creator: `${creator}`,
				result
			})
		})
		.catch(e => {
			console.log('Error :', color(e, 'red'))
			res.json(loghandler.error)
		})
	} else {
res.json(loghandler.invalidKey)
}
})

router.get('/downloader/ytmp3', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl) 
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

	let { yta, ytv } = require('../lib/api/y2mate')
	let mp3 = await yta(url, '320kbps')
	if (!mp3.title ) return res.json(loghandler.noturl)
		res.json({
			status: true,
			creator: `${creator}`,
			result: {
				Title: mp3.title,
				thumb : mp3.thumb,
				filesize: mp3.filesizeF,
				Idaudio: mp3.id,
				mp3: mp3.dl_link

	} })
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/downloader/ytmp4', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl) 
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

	let { yta, ytv } = require('../lib/api/y2mate')
	let mp4 = await ytv(url, '360p')
	if (!mp4.title ) return res.json(loghandler.noturl)
		res.json({
			status: true,
			creator: `${creator}`,
			result: {
				Title: mp4.title,
				thumb : mp4.thumb,
				filesize: mp4.filesizeF,
				Idvideo: mp4.id,
				mp4: mp4.dl_link

	} })
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/downloader/facebook', async (req, res, next) => {
	var url = req.query.url
	var apikey = req.query.apikey
	
	if (!url) return res.json(loghandler.noturl)  
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

danzz.fbdl(url)
.then(data => {
	if (!data.links) return res.json(loghandler.noturl)
	res.json({
	status: true,
	creator: `${creator}`,
	result:	data
	})
	})
	 .catch(e => {
		res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/downloader/twitter', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl)   
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
danzz.twdl(url)
.then(data => {
	if (!data.thumb ) res.json(loghandler.noturl)
var result = data
res.json({
status: true,
creator: `${creator}`,
result
})
})
.catch(e => {
res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/downloader/tiktok', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

danzz.ttdl(url)
.then(data => {
	if (!data.video ) return res.json(loghandler.noturl)
	var result = data
	res.json({
	status: true,
	creator: `${creator}`,
		result
	})
	})
	 .catch(e => {
	
		res.json(loghandler.noturl)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/downloader/igstory', async (req, res, next) => {
	var username = req.query.username
	if (!username ) return res.json(loghandler.notid)   
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
	danzz.igstory(username)
	.then(data => {
		if (!data ) return res.json(loghandler.notfound)
		var result = data
		res.json({
			status: true,
	        creator: `${creator}`,
			result
		})
		})
         .catch(e => {  
			 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/downloader/igreels', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

	danzz.igdl(url)
	.then(data => {
		if (!data ) return res.json(loghandler.noturl)
		var result = data
		res.json({
			status: true,
	        creator: `${creator}`,
			result
		})
		})
         .catch(e => {     
			 res.json(loghandler.error)	
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/downloader/instagram', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.igdl(url)
	.then(data => {
		if (!data ) return res.json(loghandler.noturl)
		var result = data
		res.json({
			status: true,
	        creator: `${creator}`,
			result
		})
		})
         .catch(e => {
         
			 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/downloader/soundcloud', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.soundcloud(url)
	.then(data => {
		if (!data.download ) return res.json(loghandler.noturl)
		var result = data
		res.json({
			status: true,
	        creator: `${creator}`,
			result
		})
		})
         .catch(e => {
         
			 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

// Asupan
router.get('/asupan/random', async (req, res, next) => {
        var apikey = req.query.apikey
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/random.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/video.mp4', data)
        res.sendFile(__path+'/tmp/video.mp4')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/asupan/santuy', async (req, res, next) => {
        var apikey = req.query.apikey
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/santuy.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/video.mp4', data)
        res.sendFile(__path+'/tmp/video.mp4')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/asupan/bocil', async (req, res, next) => {
        var apikey = req.query.apikey
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/bocil.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/video.mp4', data)
        res.sendFile(__path+'/tmp/video.mp4')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/asupan/ukhty', async (req, res, next) => {
        var apikey = req.query.apikey
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/ukhty.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/video.mp4', data)
        res.sendFile(__path+'/tmp/video.mp4')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/asupan/hijaber', async (req, res, next) => {
        var apikey = req.query.apikey
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/hijaber.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/video.mp4', data)
        res.sendFile(__path+'/tmp/video.mp4')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/asupan/gheayubi', async (req, res, next) => {
        var apikey = req.query.apikey
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/gheayubi.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/video.mp4', data)
        res.sendFile(__path+'/tmp/video.mp4')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/asupan/rikagusriani', async (req, res, next) => {
        var apikey = req.query.apikey
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/rikagusriani.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/video.mp4', data)
        res.sendFile(__path+'/tmp/video.mp4')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

// Cecan
router.get('/cecan/random', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/cecanrandom.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/cecan/hijaber', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/cecanhijaber.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/cecan/china', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/china.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/cecan/indonesia', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/indonesia.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/cecan/japan', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/japan.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/cecan/korea', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/korea.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/cecan/malaysia', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/Malaysia.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/cecan/thailand', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/thailand.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/cecan/vietnam', async (req, res, next) => {
        var apikey = req.query.apikey
        
		if (!apikey) return res.json(loghandler.notapikey)
        if(listkey.includes(apikey)){
        
        fetch(encodeURI(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/vietnam.json`))
        .then(response => response.json())
        .then(async data => {
        var result = data[Math.floor(Math.random() * data.length)];
        var buffer = result.url;
         data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/image.png', data)
        res.sendFile(__path+'/tmp/image.png')
         })
         .catch(e => {
         	console.log(e);
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

// Search
router.get('/search/youtube', async (req, res, next) => {
	var apikey = req.query.apikey
	var query = req.query.query
	if (!query ) return res.json(loghandler.notquery) 

	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
	let yts = require("yt-search")
	let search = await yts(query)
	let anu = search.videos[Math.floor(Math.random() * search.videos.length)]

	let { yta, ytv } = require('../lib/api/y2mate')
	let mp3 = await yta(anu.url, '320kbps')
	let mp4 = await ytv(anu.url, '360p')
		res.json({
			status: true,
			creator: `${creator}`,
			result: {
				Link: anu.url,
				Title: anu.title,
				Description : anu.description,
				Idvideo: anu.videoId,
				Duration: anu.timestamp,
				Viewer: anu.views,
				UploadedOn : anu.ago,
				Author : anu.author.name,
				Channel : anu.author.url,
				linkdl: {
					mp3: mp3.dl_link,
					mp4:{ 
						link: mp4.dl_link,
						filesize: mp4.filesizeF
					}
				}

	} })
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/xxxxvideo', async(req, res, next) => {
  var query = req.query.query
  var apikey = req.query.apikey
  
  if(!query) return res.json(loghandler.notquery)
  if(!apikey) return res.json(loghandler.notapikeyprem)
  
  if(listkeyprem.includes(apikey)){
    fetch(encodeURI(`http://kocakz.herokuapp.com/api/media/xvideo/search?query=${query}`))
    .then(response => response.json())
        .then(hasil => {

        var result = hasil.result;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/search/xnxxvideo', async(req, res, next) => {
  var query = req.query.query
  var apikey = req.query.apikey
  
  if(!query) return res.json(loghandler.notquery)
  if(!apikey) return res.json(loghandler.notapikeyprem)
  
  if(listkeyprem.includes(apikey)){
    fetch(encodeURI(`http://kocakz.herokuapp.com/api/media/xnxx/search?query=${query}`))
    .then(response => response.json())
        .then(hasil => {

        var result = hasil.result;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/search/pornhub', async(req, res, next) => {  
  var query = req.query.query
  var apikey = req.query.apikey
  
  if(!query) return res.json(loghandler.notquery)
  if(!apikey) return res.json(loghandler.notapikeyprem)
  
  if(listkeyprem.includes(apikey)){
    fetch(encodeURI(`http://kocakz.herokuapp.com/api/media/pornhub/search?query=${query}`))
    .then(response => response.json())
        .then(hasil => {

        var result = hasil.res;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/search/wikimedia', async (req, res, next) => {
	var query = req.query.query
	var apikey = req.query.apikey
  
	if(!query) return res.json(loghandler.notquery)
	if(!apikey) return res.json(loghandler.notapikey)
	
	if(listkey.includes(apikey)){
	danzz.wikimedia(query)
	.then((data) =>{ 
	if (!data[0] ) return res.json(loghandler.notfound)
	res.json({
	status: true,
	creator: `${creator}`,
	result: data
})
})
.catch((err) =>{
 res.json(loghandler.notfound)

})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/pinterest', async (req, res, next) => {
	var query = req.query.query
	var apikey = req.query.apikey
	
	if (!query) return res.json(loghandler.notquery)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
danzz.pinterest(query)
.then((data) =>{ 
	if (!data[0]) return res.json(loghandler.notfound)
  res.json({
	status: true,
	creator: `${creator}`,
	result: data
})
})
.catch((err) =>{
 res.json(loghandler.notfound)

})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/shoppe', async (req, res, next) => {
       	var query = req.query.query
       	var apikey = req.query.apikey
       
       	if (!query) return res.json(loghandler.notquery)
       	if (!apikey) return res.json(loghandler.notapikey)           
           if(listkey.includes(apikey)){
           	
         fetch(encodeURI(`https://api-yogipw.herokuapp.com/api/search/shoppe?query=${query}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
             	status: true,
             	creator: `${creator}`,
                 result: result
             })
         })
         .catch(e => {
         	console.log(e);
         	res.sendFile(__path + '/views/error.html')
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/gplaystore', async (req, res, next) => {
       	var query = req.query.query
       	var num = req.query.num
       	var apikey = req.query.apikey
       
       	if (!query) return res.json(loghandler.notquery)
       	if (!num) return res.json(loghandler.notnum)
       	if (!apikey) return res.json(loghandler.notapikey)           
           if(listkey.includes(apikey)){
           	
         fetch(encodeURI(`https://api-yogipw.herokuapp.com/api/search/gplaystore?query=${query}&num=${num}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
             	status: true,
             	creator: `${creator}`,
                 result: result
             })
         })
         .catch(e => {
         	console.log(e);
         	res.sendFile(__path + '/views/error.html')
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/appstore', async (req, res, next) => {
       	var query = req.query.query
       	var num = req.query.num
       	var page = req.query.page
       	var apikey = req.query.apikey
       
       	if (!query) return res.json(loghandler.notquery)
       	if (!num) return res.json(loghandler.notnum)
       	if (!page) return res.json(loghandler.notpage)
       	if (!apikey) return res.json(loghandler.notapikey)           
           if(listkey.includes(apikey)){
           	
         fetch(encodeURI(`https://api-yogipw.herokuapp.com/api/search/appstore?query=${query}&num=${num}&page=${page}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
             	status: true,
             	creator: `${creator}`,
                 result: result
             })
         })
         .catch(e => {
         	console.log(e);
         	res.sendFile(__path + '/views/error.html')
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/gsmarena', async (req, res, next) => {
       	var query = req.query.query
       	var apikey = req.query.apikey
       
       	if (!query) return res.json(loghandler.notquery)
       	if (!apikey) return res.json(loghandler.notapikey)           
           if(listkey.includes(apikey)){
           	
         fetch(encodeURI(`https://api-yogipw.herokuapp.com/api/search/gsmarena?query=${query}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
             	status: true,
             	creator: `${creator}`,
                 result: result
             })
         })
         .catch(e => {
         	console.log(e);
         	res.sendFile(__path + '/views/error.html')
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/wallpaper', async (req, res, next) => {
	var query = req.query.query
	var apikey = req.query.apikey
	
	if (!query) return res.json(loghandler.notquery)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
danzz.wallpaper(query)
.then((data) =>{ 
	if (!data[0]) return res.json(loghandler.notfound)
  res.json({
	status: true,
	creator: `${creator}`,
	result: data
})
})
.catch((err) =>{
 res.json(loghandler.notfound)

})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/google', async (req, res, next) => {
	var query = req.query.query
	var apikey = req.query.apikey
	
	if (!query) return res.json(loghandler.notquery)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
googleIt({'query': query}).then(results => {
		if (!results[0]) return res.json(loghandler.notfound)
			res.json({
				status: true,
				creator: `${creator}`,
				result: results
			})

	}).catch(e => {	
		res.json(loghandler.notfound)
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/search/googleimage', async (req, res, next) => {
	var query = req.query.query
	var apikey = req.query.apikey
	
	if (!query) return res.json(loghandler.notquery)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
var gis = require('g-i-s')
gis(query, logResults)

function logResults(error, results) {
  if (error) {
	res.json(loghandler.notfound)
  }
  else {
	if (!results[0]) return res.json(loghandler.notfound)
	res.json({
		status: true,
		creator: `${creator}`,
		result:  results
	})
   
  }
}
} else {
  res.json(loghandler.notapikey)
}
})

// Film
router.get('/film/search', async (req, res, next) => {           
       	var query = req.query.query
       	var apikey = req.query.apikey
       	
       	if (!query) return res.json(loghandler.notquery)
       	if (!apikey) return res.json(loghandler.notapikey)           
           if(listkey.includes(apikey)){
           	
         fetch(encodeURI(`https://lk21-api-zahirr.herokuapp.com/search?query=${film}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
             	status: true,
             	creator: `${creator}`,
                 result
             })
         })
         .catch(e => {
         	console.log(e);
         	res.sendFile(__path + '/views/error.html')
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/film/play', async (req, res, next) => {
           var query = req.query.query
       	var apikey = req.query.apikey
       	
       	if (!query) return res.json(loghandler.notquery)
       	if (!apikey) return res.json(loghandler.notapikey)           
           if(listkey.includes(apikey)){
           	
         fetch(encodeURI(`https://filmapik-api-zahirr.herokuapp.com/play?id=${film}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
             	status: true,
             	creator: `${creator}`,
                 result
             })
         })
         .catch(e => {
         	console.log(e);
         	res.sendFile(__path + '/views/error.html')
})
} else {
  res.json(loghandler.notapikey)
}
})

// Text Pro
router.get('/textpro/pencil', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-a-sketch-text-effect-online-1044.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/glitch', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-impressive-glitch-text-effects-online-1027.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/textpro/blackpink', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/textpro/berry', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-berry-text-effect-online-free-1033.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/textpro/neon', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/neon-light-text-effect-online-882.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})



router.get('/textpro/logobear', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/online-black-and-white-bear-mascot-logo-creation-1012.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/textpro/3dchristmas', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext) 
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/3d-christmas-text-effect-by-name-1055.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/textpro/thunder', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/online-thunder-text-effect-generator-1031.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/textpro/3dboxtext', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)   
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/3d-box-text-effect-online-880.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/textpro/glitch2', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	var apikey = req.query.apikey
	
	if (!text1) return res.json(loghandler.nottext1)   
	if (!text2) return res.json(loghandler.nottext2) 
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-a-glitch-text-effect-online-free-1026.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/glitchtiktok', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	var apikey = req.query.apikey
	
	if (!text1) return res.json(loghandler.nottext1)
	if (!text2) return res.json(loghandler.nottext2)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-glitch-text-effect-style-tik-tok-983.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/video-game-classic', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	var apikey = req.query.apikey
	
	if (!text1) return res.json(loghandler.nottext1)
	if (!text2) return res.json(loghandler.nottext2)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/video-game-classic-8-bit-text-effect-1037.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/marvel-studios', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	var apikey = req.query.apikey
	
	if (!text1) return res.json(loghandler.nottext1)
	if (!text2) return res.json(loghandler.nottext2)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-logo-style-marvel-studios-online-971.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/ninja-logo', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	var apikey = req.query.apikey
	
	if (!text1) return res.json(loghandler.nottext1)
	if (!text2) return res.json(loghandler.nottext2)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-ninja-logo-online-935.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/green-horror', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-green-horror-style-text-effect-online-1036.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/magma', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-a-magma-hot-text-effect-online-1030.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/3d-neon-light', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-3d-neon-light-text-effect-online-1028.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/3d-orange-juice', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/create-a-3d-orange-juice-text-effect-online-1084.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/chocolate-cake', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/chocolate-cake-text-effect-890.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/textpro/strawberry', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.textpro("https://textpro.me/strawberry-text-effect-online-889.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

// Photo Oxy
router.get('/photooxy/flaming', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/photooxy/shadow-sky', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/shadow-text-effect-in-the-sky-394.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/photooxy/metallic', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/other-design/create-metallic-text-glow-online-188.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/photooxy/naruto', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/photooxy/pubg', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	var apikey = req.query.apikey
	
	if (!text1) return res.json(loghandler.nottext1)
	if (!text2) return res.json(loghandler.nottext2)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/battlegrounds/make-wallpaper-battlegrounds-logo-text-146.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/photooxy/under-grass', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/photooxy/harry-potter', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/create-harry-potter-text-on-horror-background-178.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/photooxy/flower-typography', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/art-effects/flower-typography-text-effect-164.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/photooxy/picture-of-love', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/create-a-picture-of-love-message-377.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/photooxy/coffee-cup', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/put-any-text-in-to-coffee-cup-371.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/photooxy/butterfly', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/butterfly-text-with-reflection-effect-183.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/photooxy/night-sky', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/write-stars-text-on-the-night-sky-200.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/photooxy/carved-wood', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/carved-wood-effect-online-171.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})


router.get('/photooxy/illuminated-metallic', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/illuminated-metallic-effect-177.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/photooxy/sweet-candy', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.photooxy("https://photooxy.com/logo-and-text-effects/sweet-andy-text-online-168.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
} else {
  res.json(loghandler.notapikey)
}
})

// Canvas
router.get('/canvas/welcome', async (req, res, next) => {

var name = req.query.name
var mem = req.query.mem
var gcname = req.query.gcname
var picurl = req.query.picurl
var bgurl = req.query.bgurl
var apikey = req.query.apikey

if (!name) return res.json({ status : false, creator : `${creator}`, message : "Enter Name"})
if (!mem) return res.json({ status : false, creator : `${creator}`, message : "Enter Members Amount"})
if (!gcname) return res.json({ status : false, creator : `${creator}`, message : "Enter Group Name"})
if (!picurl) return res.json({ status : false, creator : `${creator}`, message : "Enter Pic Url"})
if (!bgurl) return res.json({ status : false, creator : `${creator}`, message : "Enter Background Url"})
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/welcome?name=${name}&mem=${mem}&gcname=${gcname}&picurl=${picurl}&bgurl=${bgurl}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/welcome2', async (req, res, next) => {

var name = req.query.name
var mem = req.query.mem
var gcname = req.query.gcname
var picurl = req.query.picurl
var bgurl = req.query.bgurl
var gcicon = req.query.gcicon
var apikey = req.query.apikey

if (!name) return res.json({ status : false, creator : `${creator}`, message : "Enter Name"})
if (!mem) return res.json({ status : false, creator : `${creator}`, message : "Enter Members Amount"})
if (!gcname) return res.json({ status : false, creator : `${creator}`, message : "Enter Group Name"})
if (!picurl) return res.json({ status : false, creator : `${creator}`, message : "Enter Pic Url"})
if (!bgurl) return res.json({ status : false, creator : `${creator}`, message : "Enter Background Url"})
if (!gcicon) return res.json({ status : false, creator : `${creator}`, message : "Enter Group Icon Url"})
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/welcome2?name=${name}&mem=${mem}&gcname=${gcname}&picurl=${picurl}&bgurl=${bgurl}&gcicon=${gcicon}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/goodbye', async (req, res, next) => {

var name = req.query.name
var mem = req.query.mem
var gcname = req.query.gcname
var picurl = req.query.picurl
var bgurl = req.query.bgurl
var apikey = req.query.apikey

if (!name) return res.json({ status : false, creator : `${creator}`, message : "Enter Name"})
if (!mem) return res.json({ status : false, creator : `${creator}`, message : "Enter Members Amount"})
if (!gcname) return res.json({ status : false, creator : `${creator}`, message : "Enter Group Name"})
if (!picurl) return res.json({ status : false, creator : `${creator}`, message : "Enter Pic Url"})
if (!bgurl) return res.json({ status : false, creator : `${creator}`, message : "Enter Background Url"})
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/goodbye?name=${name}&mem=${mem}&gcname=${gcname}&picurl=${picurl}&bgurl=${bgurl}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/goodbye2', async (req, res, next) => {

var name = req.query.name
var mem = req.query.mem
var gcname = req.query.gcname
var picurl = req.query.picurl
var bgurl = req.query.bgurl
var gcicon = req.query.gcicon
var apikey = req.query.apikey

if (!name) return res.json({ status : false, creator : `${creator}`, message : "Enter Name"})
if (!mem) return res.json({ status : false, creator : `${creator}`, message : "Enter Members Amount"})
if (!gcname) return res.json({ status : false, creator : `${creator}`, message : "Enter Group Name"})
if (!picurl) return res.json({ status : false, creator : `${creator}`, message : "Enter Pic Url"})
if (!bgurl) return res.json({ status : false, creator : `${creator}`, message : "Enter Background Url"})
if (!gcicon) return res.json({ status : false, creator : `${creator}`, message : "Enter Group Icon Url"})
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/goodbye2?name=${name}&mem=${mem}&gcname=${gcname}&picurl=${picurl}&bgurl=${bgurl}&gcicon=${gcicon}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/verify', async (req, res, next) => {

var name = req.query.name
var mem = req.query.mem
var sn = req.query.sn
var pp = req.query.pp
var bg = req.query.bg
var apikey = req.query.apikey

if (!name) return res.json({ status : false, creator : `${creator}`, message : "Enter Name"})
if (!mem) return res.json({ status : false, creator : `${creator}`, message : "Enter Members Amount"})
if (!sn) return res.json({ status : false, creator : `${creator}`, message : "Enter Seri"})
if (!pp) return res.json({ status : false, creator : `${creator}`, message : "Enter Pp Url"})
if (!bg) return res.json({ status : false, creator : `${creator}`, message : "Enter Background Url"})

if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://hadi-api.herokuapp.com/api/card/verify?nama=${name}&member=${mem}&seri=${sn}&pp=${pp}&bg=${bg}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/verify2', async (req, res, next) => {

var name = req.query.name
var name2 = req.query.name2
var nameverify = req.query.nameverify
var pp = req.query.pp
var pp2 = req.query.pp2
var bg = req.query.bg
var apikey = req.query.apikey

if (!name) return res.json({ status : false, creator : `${creator}`, message : "Enter Name"})
if (!name2) return res.json({ status : false, creator : `${creator}`, message : "Enter Name2"})
if (!nameverify) return res.json({ status : false, creator : `${creator}`, message : "Enter Verify Name"})
if (!pp) return res.json({ status : false, creator : `${creator}`, message : "Enter Pp Url"})
if (!pp2) return res.json({ status : false, creator : `${creator}`, message : "Enter Pp2 Url"})
if (!bg) return res.json({ status : false, creator : `${creator}`, message : "Enter Background Url"})

if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://hadi-api.herokuapp.com/api/card/verify2?name=${name}&memverify=${nameverify}&gcname=${name2}&gcicon=${pp}&pp=${pp2}&bg=${bg}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/sadcat', async (req, res, next) => {
var text = req.query.text
var apikey = req.query.apikey

if (!text) return res.json(loghandler.nottext) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/sadcat?text=${text}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/facts', async (req, res, next) => {
var text = req.query.text
var apikey = req.query.apikey

if (!text) return res.json(loghandler.nottext) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/facts?text=${text}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/pikachu', async (req, res, next) => {
var text = req.query.text
var apikey = req.query.apikey

if (!text) return res.json(loghandler.nottext) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/pikachu?text=${text}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/biden', async (req, res, next) => {
var text = req.query.text
var apikey = req.query.apikey

if (!text) return res.json(loghandler.nottext) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/biden?text=${text}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/oogway', async (req, res, next) => {
var text = req.query.text
var apikey = req.query.apikey

if (!text) return res.json(loghandler.nottext) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/oogway?text=${text}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/wanted', async (req, res, next) => {
var url = req.query.url
var apikey = req.query.apikey

if (!url) return res.json(loghandler.noturl)
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://hadi-api.herokuapp.com/api/canvas/wanted?url=${url}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/gun', async (req, res, next) => {
var url = req.query.url
var apikey = req.query.apikey

if (!url) return res.json(loghandler.noturl) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/gun?url=${url}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/greyscale', async (req, res, next) => {
var url = req.query.url
var apikey = req.query.apikey

if (!url) return res.json(loghandler.noturl) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/greyscale?url=${url}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/ad', async (req, res, next) => {
var url = req.query.url
var apikey = req.query.apikey

if (!url) return res.json(loghandler.noturl) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/ad?url=${url}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/blur', async (req, res, next) => {
var url = req.query.url
var apikey = req.query.apikey

if (!url) return res.json(loghandler.noturl) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/blur?url=${url}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/uncover', async (req, res, next) => {
var url = req.query.url
var apikey = req.query.apikey

if (!url) return res.json(loghandler.noturl) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/uncover?url=${url}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/invert', async (req, res, next) => {
var url = req.query.url
var apikey = req.query.apikey

if (!url) return res.json(loghandler.noturl) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/invert?url=${url}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/canvas/alert', async (req, res, next) => {
var url = req.query.url
var apikey = req.query.apikey

if (!url) return res.json(loghandler.noturl) 
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://myselfff.herokuapp.com/docs/canvas/alert?url=${url}`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

// Maker
router.get('/maker/ttp', async(req, res, next) => {

  const text = req.query.text
  const apikey = req.query.apikey
  
  if(!text) return res.json(loghandler.nottext)
  if(!apikey) return res.json(loghandler.notapikey)
  
  if(listkey.includes(apikey)) {
  let result = `https://hadi-api.herokuapp.com/api/canvas/ttp?text=${text}`
  data = await fetch(result).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ttp.png', data)
  res.sendFile(__path +'/tmp/ttp.png')
  } else {
    res.json(loghandler.notapikey)
  }
})

router.get('/maker/attp', async(req, res, next) => {

  const text = req.query.text
  const apikey = req.query.apikey
  
  if(!text) return res.json(loghandler.nottext)
  if(!apikey) return res.json(loghandler.notapikey)
  
  if(listkey.includes(apikey)) {
  let result = `https://hadi-api.herokuapp.com/api/canvas/attp?text=${text}`
  data = await fetch(result).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/attp.gif', data)
  res.sendFile(__path +'/tmp/attp.gif')
  } else {
    res.json(loghandler.notapikey)
  }
})

router.get('/maker/nulis', async(req, res, next) => {
  const text = req.query.text
  const apikey = req.query.apikey
  
  if(!text) return res.json(loghandler.nottext)
  if(!apikey) return res.json(loghandler.notapikey)
  
  if(listkey.includes(apikey)) {
  let result = `https://hadi-api.herokuapp.com/api/canvas/nulis?text=${text}`
  data = await fetch(result).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/nulis.png', data)
  res.sendFile(__path +'/tmp/nulis.png')
  } else {
    res.json(loghandler.notapikey)
  }
});

router.get('/maker/nulis2', async(req, res, next) => {
  const text = req.query.text
  const apikey = req.query.apikey
  
  if(!text) return res.json(loghandler.nottext)
  if(!apikey) return res.json(loghandler.notapikey)
  
  if(listkey.includes(apikey)) {
  let result = `https://hadi-api.herokuapp.com/api/canvas/nulis2?text=${text}`
  data = await fetch(result).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/nulis.png', data)
  res.sendFile(__path +'/tmp/nulis.png')
  } else {
    res.json(loghandler.notapikey)
  }
});

// Wallpaper
router.get('/wallpaper/keneki', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const keneki = JSON.parse(fs.readFileSync(__path +'/data/keneki.json'));
  const randkeneki = keneki[Math.floor(Math.random() * keneki.length)];
  data = await fetch(randkeneki).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/keneki.jpeg', data)
  res.sendFile(__path +'/tmp/keneki.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/megumin', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const megumin = JSON.parse(fs.readFileSync(__path +'/data/megumin.json'));
  const randmegumin = megumin[Math.floor(Math.random() * megumin.length)];
  data = await fetch(randmegumin).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/megumin.jpeg', data)
  res.sendFile(__path +'/tmp/megumin.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/yotsuba', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const yotsuba = JSON.parse(fs.readFileSync(__path +'/data/yotsuba.json'));
  const randyotsuba = yotsuba[Math.floor(Math.random() * yotsuba.length)];
  data = await fetch(randyotsuba).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/yotsuba.jpeg', data)
  res.sendFile(__path +'/tmp/yotsuba.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/shinomiya', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const shinomiya = JSON.parse(fs.readFileSync(__path +'/data/shinomiya.json'));
  const randshinomiya = shinomiya[Math.floor(Math.random() * shinomiya.length)];
  data = await fetch(randshinomiya).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/shinomiya.jpeg', data)
  res.sendFile(__path +'/tmp/shinomiya.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/yumeko', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const yumeko = JSON.parse(fs.readFileSync(__path +'/data/yumeko.json'));
  const randyumeko = yumeko[Math.floor(Math.random() * yumeko.length)];
  data = await fetch(randyumeko).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/yumeko.jpeg', data)
  res.sendFile(__path +'/tmp/yumeko.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/tejina', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const tejina = JSON.parse(fs.readFileSync(__path +'/data/tejina.json'));
  const randtejina = tejina[Math.floor(Math.random() * tejina.length)];
  data = await fetch(randtejina).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/tejina.jpeg', data)
  res.sendFile(__path +'/tmp/tejina.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/chiho', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const chiho = JSON.parse(fs.readFileSync(__path +'/data/chiho.json'));
  const randchiho = chiho[Math.floor(Math.random() * chiho.length)];
  data = await fetch(randchiho).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/chiho.jpeg', data)
  res.sendFile(__path +'/tmp/chiho.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/cyberspace', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const cyberspace = JSON.parse(fs.readFileSync(__path +'/data/CyberSpace.json'));
  const randcyberspace = cyberspace[Math.floor(Math.random() * cyberspace.length)];
  data = await fetch(randcyberspace).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/cyberspace.jpeg', data)
  res.sendFile(__path +'/tmp/cyberspace.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/gaming', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const gaming = JSON.parse(fs.readFileSync(__path +'/data/GameWallp.json'));
  const randgaming = gaming[Math.floor(Math.random() * gaming.length)];
  data = await fetch(randgaming).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/gaming.jpeg', data)
  res.sendFile(__path +'/tmp/gaming.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/islami', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const islami = JSON.parse(fs.readFileSync(__path +'/data/Islamic.json'));
  const randislami = islami[Math.floor(Math.random() * islami.length)];
  data = await fetch(randislami).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/islami.jpeg', data)
  res.sendFile(__path +'/tmp/islami.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/programing', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const programing = JSON.parse(fs.readFileSync(__path +'/data/Programming.json'));
  const randprograming = programing[Math.floor(Math.random() * programing.length)];
  data = await fetch(randprograming).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/programing.jpeg', data)
  res.sendFile(__path +'/tmp/programing.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/teknologi', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const teknologi = JSON.parse(fs.readFileSync(__path +'/data/Technology.json'));
  const randteknologi = teknologi[Math.floor(Math.random() * teknologi.length)];
  data = await fetch(randteknologi).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/teknologi.jpeg', data)
  res.sendFile(__path +'/tmp/teknologi.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/mountain', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const mountain = JSON.parse(fs.readFileSync(__path +'/data/Mountain.json'));
  const randmountain = mountain[Math.floor(Math.random() * mountain.length)];
  data = await fetch(randmountain).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/mountain.jpeg', data)
  res.sendFile(__path +'/tmp/mountain.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/tatasurya', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const tatasurya = JSON.parse(fs.readFileSync(__path +'/data/tatasurya.json'));
  const randtatasurya = tatasurya[Math.floor(Math.random() * tatasurya.length)];
  data = await fetch(randtatasurya).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/tatasurya.jpeg', data)
  res.sendFile(__path +'/tmp/tatasurya.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kartun', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const kartun = JSON.parse(fs.readFileSync(__path +'/data/kartun.json'));
  const randkartun = kartun[Math.floor(Math.random() * kartun.length)];
  data = await fetch(randkartun).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/kartun.jpeg', data)
  res.sendFile(__path +'/tmp/kartun.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/pentol', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const pentol = JSON.parse(fs.readFileSync(__path +'/data/pentol.json'));
  const randpentol = pentol[Math.floor(Math.random() * pentol.length)];
  data = await fetch(randpentol).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/pentol.jpeg', data)
  res.sendFile(__path +'/tmp/pentol.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/katakata', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const katakata = JSON.parse(fs.readFileSync(__path +'/data/katakata.json'));
  const randkatakata = katakata[Math.floor(Math.random() * katakata.length)];
  data = await fetch(randkatakata).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/katakata.jpeg', data)
  res.sendFile(__path +'/tmp/katakata.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/toukachan', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const toukachan = JSON.parse(fs.readFileSync(__path +'/data/toukachan.json'));
  const randtoukachan = toukachan[Math.floor(Math.random() * toukachan.length)];
  data = await fetch(randtoukachan).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/toukachan.jpeg', data)
  res.sendFile(__path +'/tmp/toukachan.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/akira', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const akira = JSON.parse(fs.readFileSync(__path +'/data/akira.json'));
  const randakira = akira[Math.floor(Math.random() * akira.length)];
  data = await fetch(randakira).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/akira.jpeg', data)
  res.sendFile(__path +'/tmp/akira.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/itori', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const itori = JSON.parse(fs.readFileSync(__path +'/data/itori.json'));
  const randitori = itori[Math.floor(Math.random() * itori.length)];
  data = await fetch(randitori).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/itori.jpeg', data)
  res.sendFile(__path +'/tmp/itori.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kurumi', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const kurumi = JSON.parse(fs.readFileSync(__path +'/data/kurumi.json'));
  const randkurumi = kurumi[Math.floor(Math.random() * kurumi.length)];
  data = await fetch(randkurumi).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/kurumi.jpeg', data)
  res.sendFile(__path +'/tmp/kurumi.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/miku', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const miku = JSON.parse(fs.readFileSync(__path +'/data/miku.json'));
  const randmiku = miku[Math.floor(Math.random() * miku.length)];
  data = await fetch(randmiku).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/miku.jpeg', data)
  res.sendFile(__path +'/tmp/miku.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/pokemon', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const pokemon = JSON.parse(fs.readFileSync(__path +'/data/pokemon.json'));
  const randpokemon = pokemon[Math.floor(Math.random() * pokemon.length)];
  data = await fetch(randpokemon).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/pokemon.jpeg', data)
  res.sendFile(__path +'/tmp/pokemon.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/ryujin', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const ryujin = JSON.parse(fs.readFileSync(__path +'/data/ryujin.json'));
  const randryujin = ryujin[Math.floor(Math.random() * ryujin.length)];
  data = await fetch(randryujin).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ryujin.jpeg', data)
  res.sendFile(__path +'/tmp/ryujin.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/rose', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const rose = JSON.parse(fs.readFileSync(__path +'/data/rose.json'));
  const randrose = rose[Math.floor(Math.random() * rose.length)];
  data = await fetch(randrose).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/rose.jpeg', data)
  res.sendFile(__path +'/tmp/rose.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kaori', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const kaori = JSON.parse(fs.readFileSync(__path +'/data/kaori.json'));
  const randkaori = kaori[Math.floor(Math.random() * kaori.length)];
  data = await fetch(randkaori).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/kaori.jpeg', data)
  res.sendFile(__path +'/tmp/kaori.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/shizuka', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const shizuka = JSON.parse(fs.readFileSync(__path +'/data/shizuka.json'));
  const randshizuka = shizuka[Math.floor(Math.random() * shizuka.length)];
  data = await fetch(randshizuka).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/shizuka.jpeg', data)
  res.sendFile(__path +'/tmp/shizuka.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kaga', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const kaga = JSON.parse(fs.readFileSync(__path +'/data/kaga.json'));
  const randkaga = kaga[Math.floor(Math.random() * kaga.length)];
  data = await fetch(randkaga).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/kaga.jpeg', data)
  res.sendFile(__path +'/tmp/kaga.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kotori', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const kotori = JSON.parse(fs.readFileSync(__path +'/data/kotori.json'));
  const randkotori = kotori[Math.floor(Math.random() * kotori.length)];
  data = await fetch(randkotori).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/kotori.jpeg', data)
  res.sendFile(__path +'/tmp/kotori.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/mikasa', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const mikasa = JSON.parse(fs.readFileSync(__path +'/data/mikasa.json'));
  const randmikasa = mikasa[Math.floor(Math.random() * mikasa.length)];
  data = await fetch(randmikasa).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/mikasa.jpeg', data)
  res.sendFile(__path +'/tmp/mikasa.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/akiyama', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const akiyama = JSON.parse(fs.readFileSync(__path +'/data/akiyama.json'));
  const randakiyama = akiyama[Math.floor(Math.random() * akiyama.length)];
  data = await fetch(randakiyama).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/akiyama.jpeg', data)
  res.sendFile(__path +'/tmp/akiyama.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/gremory', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const gremory = JSON.parse(fs.readFileSync(__path +'/data/gremory.json'));
  const randgremory = gremory[Math.floor(Math.random() * gremory.length)];
  data = await fetch(randgremory).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/gremory.jpeg', data)
  res.sendFile(__path +'/tmp/gremory.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/isuzu', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const isuzu = JSON.parse(fs.readFileSync(__path +'/data/isuzu.json'));
  const randisuzu = isuzu[Math.floor(Math.random() * isuzu.length)];
  data = await fetch(randisuzu).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/isuzu.jpeg', data)
  res.sendFile(__path +'/tmp/isuzu.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/shina', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const shina = JSON.parse(fs.readFileSync(__path +'/data/shina.json'));
  const randshina = shina[Math.floor(Math.random() * shina.length)];
  data = await fetch(randshina).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/shina.jpeg', data)
  res.sendFile(__path +'/tmp/shina.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kagura', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const kagura = JSON.parse(fs.readFileSync(__path +'/data/kagura.json'));
  const randkagura = kagura[Math.floor(Math.random() * kagura.length)];
  data = await fetch(randkagura).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/kagura.jpeg', data)
  res.sendFile(__path +'/tmp/kagura.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/shinka', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const shinka = JSON.parse(fs.readFileSync(__path +'/data/shinka.json'));
  const randshinka = shinka[Math.floor(Math.random() * shinka.length)];
  data = await fetch(randshinka).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/shinka.jpeg', data)
  res.sendFile(__path +'/tmp/shinka.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/eba', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const eba = JSON.parse(fs.readFileSync(__path +'/data/eba.json'));
  const randeba = eba[Math.floor(Math.random() * eba.length)];
  data = await fetch(randeba).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/eba.jpeg', data)
  res.sendFile(__path +'/tmp/eba.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/deidara', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Deidara = JSON.parse(fs.readFileSync(__path +'/data/deidara.json'));
  const randDeidara = Deidara[Math.floor(Math.random() * Deidara.length)];
  data = await fetch(randDeidara).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/deidara.jpeg', data)
  res.sendFile(__path +'/tmp/deidara.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/trans', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const trans = JSON.parse(fs.readFileSync(__path +'/data/trans.json'));
  const randtrans = trans[Math.floor(Math.random() * trans.length)];
  data = await fetch(randtrans).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/trans.jpeg', data)
  res.sendFile(__path +'/tmp/trans.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/jeni', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const jeni = JSON.parse(fs.readFileSync(__path +'/data/jeni.json'));
  const randjeni = jeni[Math.floor(Math.random() * jeni.length)];
  data = await fetch(randjeni).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/jeni.jpeg', data)
  res.sendFile(__path +'/tmp/jeni.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/jiso', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const jiso = JSON.parse(fs.readFileSync(__path +'/data/jiso.json'));
  const randjiso = jiso[Math.floor(Math.random() * jiso.length)];
  data = await fetch(randjiso).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/jiso.jpeg', data)
  res.sendFile(__path +'/tmp/jiso.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/satanic', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const satanic = JSON.parse(fs.readFileSync(__path +'/data/satanic.json'));
  const randsatanic = satanic[Math.floor(Math.random() * satanic.length)];
  data = await fetch(randsatanic).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/satanic.jpeg', data)
  res.sendFile(__path +'/tmp/satanic.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/cecan2', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const cecan2 = JSON.parse(fs.readFileSync(__path +'/data/cecan2.json'));
  const randcecan2 = cecan2[Math.floor(Math.random() * cecan2.length)];
  data = await fetch(randcecan2).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/cecan2.jpeg', data)
  res.sendFile(__path +'/tmp/cecan2.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/cogan2', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const cogan2 = JSON.parse(fs.readFileSync(__path +'/data/cogan2.json'));
  const randcogan2 = cogan2[Math.floor(Math.random() * cogan2.length)];
  data = await fetch(randcogan2).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/cogan2.jpeg', data)
  res.sendFile(__path +'/tmp/cogan2.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/itachi', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Itachi = JSON.parse(fs.readFileSync(__path +'/data/itachi.json'));
  const randItachi = Itachi[Math.floor(Math.random() * Itachi.length)];
  data = await fetch(randItachi).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ita.jpeg', data)
  res.sendFile(__path +'/tmp/ita.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/madara', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Madara = JSON.parse(fs.readFileSync(__path +'/data/madara.json'));
  const randMadara = Madara[Math.floor(Math.random() * Madara.length)];
  data = await fetch(randMadara).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/madara.jpeg', data)
  res.sendFile(__path +'/tmp/madara.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/yuki', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Yuki = JSON.parse(fs.readFileSync(__path +'/data/yuki.json'));
  const randYuki = Yuki[Math.floor(Math.random() * Yuki.length)];
  data = await fetch(randYuki).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/yuki.jpeg', data)
  res.sendFile(__path +'/tmp/yuki.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/asuna', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const asuna = JSON.parse(fs.readFileSync(__path +'/data/asuna.json'));
  const randasuna = asuna[Math.floor(Math.random() * asuna.length)];
  data = await fetch(randasuna).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/asuna.jpeg', data)
  res.sendFile(__path +'/tmp/asuna.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/ayuzawa', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const ayuzawa = JSON.parse(fs.readFileSync(__path +'/data/ayuzawa.json'));
  const randayuzawa = ayuzawa[Math.floor(Math.random() * ayuzawa.length)];
  data = await fetch(randayuzawa).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ayuzawa.jpeg', data)
  res.sendFile(__path +'/tmp/ayuzawa.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/chitoge', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const chitoge = JSON.parse(fs.readFileSync(__path +'/data/chitoge.json'));
  const randchitoge = chitoge[Math.floor(Math.random() * chitoge.length)];
  data = await fetch(randchitoge).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/chitoge.jpeg', data)
  res.sendFile(__path +'/tmp/chitoge.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/emilia', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const emilia = JSON.parse(fs.readFileSync(__path +'/data/emilia.json'));
  const randemilia = emilia[Math.floor(Math.random() * emilia.length)];
  data = await fetch(randemilia).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/emilia.jpeg', data)
  res.sendFile(__path +'/tmp/emilia.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/hestia', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const hestia = JSON.parse(fs.readFileSync(__path +'/data/hestia.json'));
  const randhestia = hestia[Math.floor(Math.random() * hestia.length)];
  data = await fetch(randhestia).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/hestia.jpeg', data)
  res.sendFile(__path +'/tmp/hestia.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/inori', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const inori = JSON.parse(fs.readFileSync(__path +'/data/inori.json'));
  const randinori = inori[Math.floor(Math.random() * inori.length)];
  data = await fetch(randinori).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/inori.jpeg', data)
  res.sendFile(__path +'/tmp/inori.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/ana', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const ana = JSON.parse(fs.readFileSync(__path +'/data/ana.json'));
  const randana = ana[Math.floor(Math.random() * ana.length)];
  data = await fetch(randana).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ana.jpeg', data)
  res.sendFile(__path +'/tmp/ana.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/boruto', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Boruto = JSON.parse(fs.readFileSync(__path +'/data/boruto.json'));
  const randBoruto = Boruto[Math.floor(Math.random() * Boruto.length)];
  data = await fetch(randBoruto).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/bor.jpeg', data)
  res.sendFile(__path +'/tmp/bor.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/erza', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Erza = JSON.parse(fs.readFileSync(__path +'/data/erza.json'));
  const randErza = Erza[Math.floor(Math.random() * Erza.length)];
  data = await fetch(randErza).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/erza.jpeg', data)
  res.sendFile(__path +'/tmp/erza.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kakasih', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Kakasih = JSON.parse(fs.readFileSync(__path +'/data/kakasih.json'));
  const randKakasih = Kakasih[Math.floor(Math.random() * Kakasih.length)];
  data = await fetch(randKakasih).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ka.jpeg', data)
  res.sendFile(__path +'/tmp/ka.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/sagiri', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Sagiri = JSON.parse(fs.readFileSync(__path +'/data/sagiri.json'));
  const randSagiri = Sagiri[Math.floor(Math.random() * Sagiri.length)];
  data = await fetch(randSagiri).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/sagiri.jpeg', data)
  res.sendFile(__path +'/tmp/sagiri.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/minato', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Minato = JSON.parse(fs.readFileSync(__path +'/data/minato.json'));
  const randMinato = Minato[Math.floor(Math.random() * Minato.length)];
  data = await fetch(randMinato).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/minato.jpeg', data)
  res.sendFile(__path +'/tmp/minato.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/naruto', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Naruto = JSON.parse(fs.readFileSync(__path +'/data/naruto.json'));
  const randNaruto = Naruto[Math.floor(Math.random() * Naruto.length)];
  data = await fetch(randNaruto).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/naruto.jpeg', data)
  res.sendFile(__path +'/tmp/naruto.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/nezuko', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Nezuko = JSON.parse(fs.readFileSync(__path +'/data/nezuko.json'));
  const randNezuko = Nezuko[Math.floor(Math.random() * Nezuko.length)];
  data = await fetch(randNezuko).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/nezu.jpeg', data)
  res.sendFile(__path +'/tmp/nezu.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/onepiece', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Pic = JSON.parse(fs.readFileSync(__path +'/data/onepiece.json'));
  const randPic = Pic[Math.floor(Math.random() * Pic.length)];
  data = await fetch(randPic).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/pic.jpeg', data)
  res.sendFile(__path +'/tmp/pic.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/rize', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Rize = JSON.parse(fs.readFileSync(__path +'/data/rize.json'));
  const randRize = Rize[Math.floor(Math.random() * Rize.length)];
  data = await fetch(randRize).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/rize.jpeg', data)
  res.sendFile(__path +'/tmp/rize.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/sakura', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Sakura = JSON.parse(fs.readFileSync(__path +'/data/sakura.json'));
  const randSakura = Sakura[Math.floor(Math.random() * Sakura.length)];
  data = await fetch(randSakura).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/sakura.jpeg', data)
  res.sendFile(__path +'/tmp/sakura.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/sasuke', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Sasuke = JSON.parse(fs.readFileSync(__path +'/data/sasuke.json'));
  const randSasuke = Sasuke[Math.floor(Math.random() * Sasuke.length)];
  data = await fetch(randSasuke).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/sasuke.jpeg', data)
  res.sendFile(__path +'/tmp/sasuke.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/tsunade', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Su = JSON.parse(fs.readFileSync(__path +'/data/tsunade.json'));
  const randSu = Su[Math.floor(Math.random() * Su.length)];
  data = await fetch(randSu).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/su.jpeg', data)
  res.sendFile(__path +'/tmp/su.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/montor', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Mon = JSON.parse(fs.readFileSync(__path +'/data/montor.json'));
  const randMon = Mon[Math.floor(Math.random() * Mon.length)];
  data = await fetch(randMon).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/montor.jpeg', data)
  res.sendFile(__path+ '/tmp/montor.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/mobil', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Mob = JSON.parse(fs.readFileSync(__path +'/data/mobil.json'));
  const randMob = Mob[Math.floor(Math.random() * Mob.length)];
  data = await fetch(randMob).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/mobil.jpeg', data)
  res.sendFile(__path+ '/tmp/mobil.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/boneka-chucky', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Bon = JSON.parse(fs.readFileSync(__path +'/data/boneka.json'));
  const randBon = Bon[Math.floor(Math.random() * Bon.length)];
  data = await fetch(randBon).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/chucky.jpeg', data)
  res.sendFile(__path+ '/tmp/chucky.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/anime', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Wai23 = JSON.parse(fs.readFileSync(__path +'/data/wallhp2.json'));
  const randWai23 = Wai23[Math.floor(Math.random() * Wai23.length)];
  data = await fetch(randWai23).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/wallhp2.jpeg', data)
  res.sendFile(__path+ '/tmp/wallhp2.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/random/blackpink', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Black = JSON.parse(fs.readFileSync(__path +'/data/blackpink.json'));
  const randBlack = Black[Math.floor(Math.random() * Black.length)]
  data = await fetch(randBlack).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/blak.jpeg', data)
  res.sendFile(__path +'/tmp/blak.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/wallhp', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Wai22 = JSON.parse(fs.readFileSync(__path +'/data/wallhp.json'));
  const randWai22 = Wai22[Math.floor(Math.random() * Wai22.length)];
  data = await fetch(randWai22).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/wallhp.jpeg', data)
  res.sendFile(__path+ '/tmp/wallhp.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/waifu2', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Wai2 = JSON.parse(fs.readFileSync(__path +'/data/waifu2.json'));
  const randWai2 = Wai2[Math.floor(Math.random() * Wai2.length)];
  data = await fetch(randWai2).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/wibu2.jpeg', data)
  res.sendFile(__path+ '/tmp/wibu2.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/waifu', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Wai = JSON.parse(fs.readFileSync(__path +'/data/waifu.json'));
  const randWai = Wai[Math.floor(Math.random() * Wai.length)];
  data = await fetch(randWai).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/wibu.jpeg', data)
  res.sendFile(__path+ '/tmp/wibu.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kpop', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Kpop = JSON.parse(fs.readFileSync(__path +'/data/kpop.json'));
  const randKpop = Kpop[Math.floor(Math.random() * Kpop.length)]
  data = await fetch(randKpop).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/kpop.jpeg', data)
  res.sendFile(__path +'/tmp/kpop.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/hekel', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Hekel = JSON.parse(fs.readFileSync(__path +'/data/hekel.json'));
  const randHekel = Hekel[Math.floor(Math.random() * Hekel.length)]
  data = await fetch(randHekel).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/hek.jpeg', data)
  res.sendFile(__path +'/tmp/hek.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/kucing', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Kucing = JSON.parse(fs.readFileSync(__path +'/data/kucing.json'));
  const randKucing = Kucing[Math.floor(Math.random() * Kucing.length)]
  data = await fetch(randKucing).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/kucing.jpeg', data)
  res.sendFile(__path +'/tmp/kucing.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/pubg', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Pubg = JSON.parse(fs.readFileSync(__path +'/data/pubg.json'));
  const randPubg = Pubg[Math.floor(Math.random() * Pubg.length)]
  data = await fetch(randPubg).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/pubg.jpeg', data)
  res.sendFile(__path +'/tmp/pubg.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/ppcouple', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Pp = JSON.parse(fs.readFileSync(__path +'/data/profil.json'));
  const randPp = Pp[Math.floor(Math.random() * Pp.length)]
  data = await fetch(randPp).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/pp.jpeg', data)
  res.sendFile(__path +'/tmp/pp.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/anjing', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Anjing = JSON.parse(fs.readFileSync(__path +'/data/anjing.json'));
  const randAnjing = Anjing[Math.floor(Math.random() * Anjing.length)]
  data = await fetch(randAnjing).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ajg.jpeg', data)
  res.sendFile(__path +'/tmp/ajg.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/doraemon', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Dora = JSON.parse(fs.readFileSync(__path +'/data/doraemon.json'));
  const randDora = Dora[Math.floor(Math.random() * Dora.length)]
  data = await fetch(randDora).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/dora.jpeg', data)
  res.sendFile(__path +'/tmp/dora.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/cogan', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  Cogan = JSON.parse(fs.readFileSync(__path +'/data/cogan.json'));
  const randCogan = Cogan[Math.floor(Math.random() * Cogan.length)]
  data = await fetch(randCogan).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/cogan.jpeg', data)
  res.sendFile(__path +'/tmp/cogan.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})


router.get('/wallpaper/elaina', async (req, res, next) => {
        const Apikey = req.query.apikey;
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

const Elaina = JSON.parse(fs.readFileSync(__path +'/data/elaina.json'))
const randElaina = Elaina[Math.floor(Math.random() * Elaina.length)]
//tansole.log(randLoli)
data = await fetch(randElaina).then(v => v.buffer())
await fs.writeFileSync(__path +'/tmp/elaina.jpeg', data)
res.sendFile(__path +'/tmp/elaina.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})


router.get('/wallpaper/loli', async (req, res, next) => {
        const Apikey = req.query.apikey;
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

const Loli = JSON.parse(fs.readFileSync(__path +'/data/loli.json'))
const randLoli = Loli[Math.floor(Math.random() * Loli.length)]
//tansole.log(randLoli)
data = await fetch(randLoli).then(v => v.buffer())
await fs.writeFileSync(__path +'/tmp/loli.jpeg', data)
res.sendFile(__path +'/tmp/loli.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})


router.get('/wallpaper/yuri', async (req, res, next) => {
        const Apikey = req.query.apikey;
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

const Yuri = JSON.parse(fs.readFileSync(__path +'/data/yuri.json'))
const randYuri = Yuri[Math.floor(Math.random() * Yuri.length)]
//tansole.log(randTech)
data = await fetch(randYuri).then(v => v.buffer())
await fs.writeFileSync(__path +'/tmp/Yuri.jpeg', data)
res.sendFile(__path +'/tmp/Yuri.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})


router.get('/wallpaper/cecan', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const cecan = JSON.parse(fs.readFileSync(__path +'/data/cecan.json'));
  const randCecan = cecan[Math.floor(Math.random() * cecan.length)];
  data = await fetch(randCecan).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/cecan.jpeg', data)
  res.sendFile(__path +'/tmp/cecan.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})


router.get('/wallpaper/aesthetic', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Aesthetic = JSON.parse(fs.readFileSync(__path +'/data/aesthetic.json'));
  const randAesthetic = Aesthetic[Math.floor(Math.random() * Aesthetic.length)];
  data = await fetch(randAesthetic).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/aesthetic.jpeg', data)
  res.sendFile(__path +'/tmp/aesthetic.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})


router.get('/wallpaper/justina', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Justina = JSON.parse(fs.readFileSync(__path +'/data/justina.json'));
  const randJus = Justina[Math.floor(Math.random() * Justina.length)];
  data = await fetch(randJus).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/justina.jpeg', data)
  res.sendFile(__path +'/tmp/justina.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})


router.get('/wallpaper/sagiri', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Sagiri = JSON.parse(fs.readFileSync(__path +'/data/sagiri.json'));
  const randSagiri = Sagiri[Math.floor(Math.random() * Sagiri.length)];
  data = await fetch(randSagiri).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/sagiri.jpeg', data)
  res.sendFile(__path +'/tmp/sagiri.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/shota', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Shota = JSON.parse(fs.readFileSync(__path +'/data/shota.json'));
  const randShota = Shota[Math.floor(Math.random() * Shota.length)];
  data = await fetch(randShota).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/shota.jpeg', data)
  res.sendFile(__path+ '/tmp/shota.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/nsfwloli', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Lol = JSON.parse(fs.readFileSync(__path +'/data/nsfwloli.json'));
  const randLol = Lol[Math.floor(Math.random() * Lol.length)];
  data = await fetch(randLol).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/lol.jpeg', data)
  res.sendFile(__path+ '/tmp/lol.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/wallpaper/hinata', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Hinata = JSON.parse(fs.readFileSync(__path +'/data/hinata.json'));
  const randHin = Hinata[Math.floor(Math.random() * Hinata.length)];
  data = await fetch(randHin).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/Hinata.jpeg', data)
  res.sendFile(__path+ '/tmp/Hinata.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

// Game
router.get('/game/asahotak', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/asahotak.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/caklontong', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/caklontong.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/truth', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/truth.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/dare', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/dare.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/darkjoke', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/darkjoke.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/family100', async (req, res, next) => {
    var Apikey = req.query.apikey

    if(!Apikey) return res.json(loghandler.notparam)
    if(listkey.includes(Apikey)){
        var soal = JSON.parse(
            fs.readFileSync(__path + '/data/family100.json')
        )
        res
          .status(200)
          .json({
              code: 200,
              success: true,
              ...soal[~~(Math.random() * soal.length)]
          })
    } else {
        res.json(loghandler.invalidKey)
    }
})
router.get('/game/pantun', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/pantun.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/siapakahaku', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/siapakahaku.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/tebakgabut', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/tebakgabut.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/tebaklucu', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/tebaklucu.json')
	var result = data[Math.floor(Math.random() * data.length)];
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: result
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/tebakgambar', async (req, res, next) => {
	var apikey = req.query.apikey
	
	if(!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
	danzz.tebakgambar()
.then((data) =>{ 
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: data
})
})
.catch((err) =>{
 res.json(loghandler.error)

})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/game/susunkata', async (req, res, next) => {
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
		
	let tebak = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/susunkata.json')
	let tebak2 = tebak[Math.floor(Math.random() * tebak.length)]
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: tebak2
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/game/tebakbendera', async (req, res, next) => {
    var Apikey = req.query.apikey

    if(!Apikey) return res.json(loghandler.notparam)
    if(listkey.includes(Apikey)){
        var bendera = JSON.parse(
            fs.readFileSync(__path + '/data/tebakbendera.json')
        )
        res
          .status(200)
          .json({
              code: 200,
              success: true,
              ...bendera[~~(Math.random() * bendera.length)]
          })
    } else {
        res.json(loghandler.invalidKey)
    }
})


router.get('/game/tebakgame', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let tebak = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/tebakgame.json')
	let tebak2 = tebak[Math.floor(Math.random() * tebak.length)]
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: tebak2
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/game/tebakkata', async (req, res, next) => {
    var Apikey = req.query.apikey

    if(!Apikey) return res.json(loghandler.notparam)
    if(listkey.includes(Apikey)){
        var soal = JSON.parse(
            fs.readFileSync(__path + '/data/tebakkata.json')
        )
        res
          .status(200)
          .json({
              code: 200,
              success: true,
              ...soal[~~(Math.random() * soal.length)]
          })
    } else {
        res.json(loghandler.invalidKey)
    }
})

router.get('/game/tebakchara', async (req, res, next) => {
    var Apikey = req.query.apikey

    if(!Apikey) return res.json(loghandler.notparam)
    if(listkey.includes(Apikey)){
        var name = JSON.parse(
            fs.readFileSync(__path + '/data/tebakchara.json')
        )
        res
          .status(200)
          .json({
              code: 200,
              success: true,
              ...name[~~(Math.random() * name.length)]
          })
    } else {
        res.json(loghandler.invalidKey)
    }
})

router.get('/game/tebaklirik', async (req, res, next) => {
    var Apikey = req.query.apikey

    if(!Apikey) return res.json(loghandler.notparam)
    if(listkey.includes(Apikey)){
        var question = JSON.parse(
            fs.readFileSync(__path + '/data/tebaklirik.json')
        )
        res
          .status(200)
          .json({
              code: 200,
              success: true,
              ...question[~~(Math.random() * question.length)]
          })
    } else {
        res.json(loghandler.invalidKey)
    }
})
router.get('/game/tebaklagu', async (req, res, next) => {
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!apikey) return res.json(loghandler.notapikey)
	
	let tebak = await fetchJson('https://raw.githubusercontent.com/CeptiRest/Restapi/main/tebaklagu.json')
	let tebak2 = tebak[Math.floor(Math.random() * tebak.length)]
		  
  res.json({
	status: true,
	creator: `${creator}`,
	result: tebak2
})
} else {
  res.json(loghandler.notapikey)
}
})
router.get('/game/tebakkimia', async (req, res, next) => {
    var Apikey = req.query.apikey

    if(!Apikey) return res.json(loghandler.notparam)
    if(listkey.includes(Apikey)){
        var nama = JSON.parse(
            fs.readFileSync(__path + '/data/tebakkimia.json')
        )
        res
          .status(200)
          .json({
              code: 200,
              success: true,
              ...nama[~~(Math.random() * nama.length)]
          })
    } else {
        res.json(loghandler.invalidKey)
    }
})

// Simi
router.get('/fun/simi', async (req, res, next) => {
        var apikey = req.query.apikey
        var text = req.query.text
        var lang = req.query.lang
   
		if(!apikey) return res.json(loghandler.notapikey)
		if(listkey.includes(apikey)){
        if(!text) return res.json(loghandler.nottext)
        if(!lang) return res.json({ message: 'Enter Lang' })

       fetch(encodeURI(`https://simsumi.herokuapp.com/api?text=${text}&lang=${lang}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
res.json(loghandler.notapikey)
}
})
router.get('/fun/simi-en', async (req, res, next) => {
        var apikey = req.query.apikey
        var text = req.query.text
   
		if(!apikey) return res.json(loghandler.notapikey)
		if(listkey.includes(apikey)){
        if(!text) return res.json(loghandler.nottext)

       fetch(encodeURI(`https://simsumi.herokuapp.com/api?text=${text}&lang=en`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
res.json(loghandler.notapikey)
}
})

router.get('/fun/simi-jp', async (req, res, next) => {
        var apikey = req.query.apikey
        var text = req.query.text
   
		if(!apikey) return res.json(loghandler.notapikey)
		if(listkey.includes(apikey)){
        if(!text) return res.json(loghandler.nottext)

       fetch(encodeURI(`https://simsumi.herokuapp.com/api?text=${text}&lang=jp`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
res.json(loghandler.notapikey)
}
})

router.get('/fun/simi-id', async (req, res, next) => {
        var apikey = req.query.apikey
        var text = req.query.text
   
		if(!apikey) return res.json(loghandler.notapikey)
		if(listkey.includes(apikey)){
        if(!text) return res.json(loghandler.nottext)

       fetch(encodeURI(`https://simsumi.herokuapp.com/api?text=${text}&lang=id`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
res.json(loghandler.notapikey)
}
})

router.get('/fun/simi-ar', async (req, res, next) => {
        var apikey = req.query.apikey
        var text = req.query.text
   
		if(!apikey) return res.json(loghandler.notapikey)
		if(listkey.includes(apikey)){
        if(!text) return res.json(loghandler.nottext)

       fetch(encodeURI(`https://simsumi.herokuapp.com/api?text=${text}&lang=ar`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
res.json(loghandler.notapikey)
}
})

// Sfw
router.get('/sfw/waifu', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const Wai = JSON.parse(fs.readFileSync(__path +'/data/waifu.json'));
  const randWai = Wai[Math.floor(Math.random() * Wai.length)];
  data = await fetch(randWai).then(v => v.buffer());
  await fs.writeFileSync(__path +'/tmp/wibu.jpeg', data)
  res.sendFile(__path+ '/tmp/wibu.jpeg');
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/sfw/neko', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const neko2 = JSON.parse(fs.readFileSync(__path +'/data/neko2.json'));
  const randneko2 = neko2[Math.floor(Math.random() * neko2.length)];
  data = await fetch(randneko2).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/neko2.jpeg', data)
  res.sendFile(__path +'/tmp/neko2.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/sfw/shinobu', async (req, res, next) => {
var apikey = req.query.apikey
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/sfw/shinobu`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/sfw/megumin', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const megumin = JSON.parse(fs.readFileSync(__path +'/data/megumin.json'));
  const randmegumin = megumin[Math.floor(Math.random() * megumin.length)];
  data = await fetch(randmegumin).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/megumin.jpeg', data)
  res.sendFile(__path +'/tmp/megumin.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/sfw/bully', async (req, res, next) => {
var apikey = req.query.apikey
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/sfw/bully`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/sfw/cuddle', async (req, res, next) => {
var apikey = req.query.apikey
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/sfw/cuddle`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/sfw/cry', async (req, res, next) => {
var apikey = req.query.apikey
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/sfw/cry`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/sfw/kiss', async (req, res, next) => {
var apikey = req.query.apikey
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/sfw/kiss`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/sfw/hug', async (req, res, next) => {
var apikey = req.query.apikey
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/sfw/hug`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/sfw/awoo', async (req, res, next) => {
var apikey = req.query.apikey
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/sfw/awoo`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/sfw/lick', async (req, res, next) => {
var apikey = req.query.apikey
if(!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){
	
var requestSettings = {
url: `https://api-yogipw.herokuapp.com/api/sfw/lick`, method: 'GET', encoding: null };
request(requestSettings, function(error, response, body) {
res.set('Content-Type', 'image/png');
res.send(body)
})
} else {
  res.json(loghandler.notapikey)
}
})

// Nsfw
router.get('/nsfw/hentai', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const hentai = JSON.parse(fs.readFileSync(__path +'/data/hentai.json'));
  const randhentai = hentai[Math.floor(Math.random() * hentai.length)];
  data = await fetch(randhentai).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/hentai.jpeg', data)
  res.sendFile(__path +'/tmp/hentai.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/hentaigif', async (req, res, next) => {
          var apikey = req.query.apikey
          if (!apikey) return res.json(loghandler.notapikey)
          if(listkey.includes(apikey)){
		 fetch(encodeURI(`https://raw.githubusercontent.com/Danzzxcodes/scraper/main/nsfw/hentaigif.json`))
        .then(response => response.json())
        .then(data => {
        var result = data[Math.floor(Math.random() * data.length)];
             res.json({
             	status: true,
             	creator: `${creator}`,
             	result: result
             })
         })
         .catch(e => {
         	console.log(e);
         	res.sendFile(__path + '/views/error.html')
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/nsfw/neko', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const neko = JSON.parse(fs.readFileSync(__path +'/data/neko.json'));
  const randneko = neko[Math.floor(Math.random() * neko.length)];
  data = await fetch(randneko).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/neko.jpeg', data)
  res.sendFile(__path +'/tmp/neko.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/orgy', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const orgy = JSON.parse(fs.readFileSync(__path +'/data/orgy.json'));
  const randorgy = orgy[Math.floor(Math.random() * orgy.length)];
  data = await fetch(randorgy).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/orgy.jpeg', data)
  res.sendFile(__path +'/tmp/orgy.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/panties', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const panties = JSON.parse(fs.readFileSync(__path +'/data/panties.json'));
  const randpanties = panties[Math.floor(Math.random() * panties.length)];
  data = await fetch(randpanties).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/panties.jpeg', data)
  res.sendFile(__path +'/tmp/panties.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/foot', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const foot = JSON.parse(fs.readFileSync(__path +'/data/foot.json'));
  const randfoot = foot[Math.floor(Math.random() * foot.length)];
  data = await fetch(randfoot).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/foot.jpeg', data)
  res.sendFile(__path +'/tmp/foot.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/cuckold', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const cuckold = JSON.parse(fs.readFileSync(__path +'/data/cuckold.json'));
  const randcuckold = cuckold[Math.floor(Math.random() * cuckold.length)];
  data = await fetch(randcuckold).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/cuckold.jpeg', data)
  res.sendFile(__path +'/tmp/cuckold.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/pussy', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const pussy = JSON.parse(fs.readFileSync(__path +'/data/pussy.json'));
  const randpussy = pussy[Math.floor(Math.random() * pussy.length)];
  data = await fetch(randpussy).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/pussy.jpeg', data)
  res.sendFile(__path +'/tmp/pussy.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/yuri', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const yuri = JSON.parse(fs.readFileSync(__path +'/data/yuri.json'));
  const randyuri = yuri[Math.floor(Math.random() * yuri.length)];
  data = await fetch(randyuri).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/yuri.jpeg', data)
  res.sendFile(__path +'/tmp/yuri.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/jahy', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const jahy = JSON.parse(fs.readFileSync(__path +'/data/jahy.json'));
  const randjahy = jahy[Math.floor(Math.random() * jahy.length)];
  data = await fetch(randjahy).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/jahy.jpeg', data)
  res.sendFile(__path +'/tmp/jahy.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/ahegao', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const ahegao = JSON.parse(fs.readFileSync(__path +'/data/ahegao.json'));
  const randahegao = ahegao[Math.floor(Math.random() * ahegao.length)];
  data = await fetch(randahegao).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ahegao.jpeg', data)
  res.sendFile(__path +'/tmp/ahegao.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/bdsm', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const bdsm = JSON.parse(fs.readFileSync(__path +'/data/bdsm.json'));
  const randbdsm = bdsm[Math.floor(Math.random() * bdsm.length)];
  data = await fetch(randbdsm).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/bdsm.jpeg', data)
  res.sendFile(__path +'/tmp/bdsm.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/blowjob', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const blowjob = JSON.parse(fs.readFileSync(__path +'/data/blowjob.json'));
  const randblowjob = blowjob[Math.floor(Math.random() * blowjob.length)];
  data = await fetch(randblowjob).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/blowjob.jpeg', data)
  res.sendFile(__path +'/tmp/blowjob.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/cum', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const cum = JSON.parse(fs.readFileSync(__path +'/data/cum.json'));
  const randcum = cum[Math.floor(Math.random() * cum.length)];
  data = await fetch(randcum).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/cum.jpeg', data)
  res.sendFile(__path +'/tmp/cum.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/ero', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const ero = JSON.parse(fs.readFileSync(__path +'/data/ero.json'));
  const randero = ero[Math.floor(Math.random() * ero.length)];
  data = await fetch(randero).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/ero.jpeg', data)
  res.sendFile(__path +'/tmp/ero.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/femdom', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const femdom = JSON.parse(fs.readFileSync(__path +'/data/femdom.json'));
  const randfemdom = femdom[Math.floor(Math.random() * femdom.length)];
  data = await fetch(randfemdom).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/femdom.jpeg', data)
  res.sendFile(__path +'/tmp/femdom.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/gangbang', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const gangbang = JSON.parse(fs.readFileSync(__path +'/data/gangbang.json'));
  const randgangbang = gangbang[Math.floor(Math.random() * gangbang.length)];
  data = await fetch(randgangbang).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/gangbang.jpeg', data)
  res.sendFile(__path +'/tmp/gangbang.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/glasses', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const glasses = JSON.parse(fs.readFileSync(__path +'/data/glasses.json'));
  const randglasses = glasses[Math.floor(Math.random() * glasses.length)];
  data = await fetch(randglasses).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/glasses.jpeg', data)
  res.sendFile(__path +'/tmp/glasses.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/thighs', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const thighs = JSON.parse(fs.readFileSync(__path +'/data/thighs.json'));
  const randthighs = thighs[Math.floor(Math.random() * thighs.length)];
  data = await fetch(randthighs).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/thighs.jpeg', data)
  res.sendFile(__path +'/tmp/thighs.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/zettai', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const zettai = JSON.parse(fs.readFileSync(__path +'/data/zettai.json'));
  const randzettai = zettai[Math.floor(Math.random() * zettai.length)];
  data = await fetch(randzettai).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/zettai.jpeg', data)
  res.sendFile(__path +'/tmp/zettai.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/manga', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const manga = JSON.parse(fs.readFileSync(__path +'/data/manga.json'));
  const randmanga = manga[Math.floor(Math.random() * manga.length)];
  data = await fetch(randmanga).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/manga.jpeg', data)
  res.sendFile(__path +'/tmp/manga.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/tentacles', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const tentacles = JSON.parse(fs.readFileSync(__path +'/data/tentacles.json'));
  const randtentacles = tentacles[Math.floor(Math.random() * tentacles.length)];
  data = await fetch(randtentacles).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/tentacles.jpeg', data)
  res.sendFile(__path +'/tmp/tentacles.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/nsfw/masturbation', async (req, res, next) => {
        var Apikey = req.query.apikey
            
	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

  const masturbation = JSON.parse(fs.readFileSync(__path +'/data/masturbation.json'));
  const randmasturbation = masturbation[Math.floor(Math.random() * masturbation.length)];
  data = await fetch(randmasturbation).then(v => v.buffer())
  await fs.writeFileSync(__path +'/tmp/masturbation.jpeg', data)
  res.sendFile(__path +'/tmp/masturbation.jpeg')
} else {
res.json(loghandler.invalidKey)
}
})

// Random
router.get('/random/meme', async (req, res, next) => {  
var apikey = req.query.apikey

if (!apikey) return res.json(loghandler.notapikey)
if(listkey.includes(apikey)){

fetch(encodeURI(`https://api-yogipw.herokuapp.com/api/random/meme`))
.then(response => response.json())
.then(data => { var result = data;
res.json({ result })
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/quotes', async (req, res, next) => {
        var apikey = req.query.apikey
            
		if(!apikey) return res.json(loghandler.notapikey)
		if(listkey.includes(apikey)){

       fetch(encodeURI(`http://kocakz.herokuapp.com/api/random/text/quotes`))
        .then(response => response.json())
        .then(hasil => {
        var result = hasil.result;
             res.json({
                 creator : `${creator}`,
                 result
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
} else {
res.json(loghandler.notapikey)
}
})

router.get('/random/couplepp', async (req, res, next) => {
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if (!apikey) return res.json(loghandler.notapikey)
	
	let resultt = await fetchJson('https://raw.githubusercontent.com/Ramdaniofficial/result-rest-api/main/kopel.json')
	let random = resultt[Math.floor(Math.random() * resultt.length)]

	res.json({
	status: true,
	creator: `${creator}`,
		result: {
			male: random.male,
			female: random.female
		}
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/dadu', async (req, res, next) => {
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if (!apikey) return res.json(loghandler.notapikey)
	
	let dadu = await fetchJson('https://raw.githubusercontent.com/Ramdaniofficial/result-rest-api/main/dadu.json')
	let random = dadu[Math.floor(Math.random() * dadu.length)]
	var result = await getBuffer(random.result)
	res.set({'Content-Type': 'image/webp'})
	res.send(result)
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/coffee', async (req, res, next) => {
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if (!apikey) return res.json(loghandler.notapikey)
	
	var result = await getBuffer('https://coffee.alexflipnote.dev/random')
	res.set({'Content-Type': 'image/png'})
	res.send(result)
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/balikhuruf', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/balikhuruf?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/balikangka', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/balikangka?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/bilangangka', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/bilangangka?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/besarkecil', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/besarkecil?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/heleh', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/heleh?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/huluh', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/huluh?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/hilih', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/hilih?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/halah', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/halah?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/kapital', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/kapital?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/katajago', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/katajago?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/resepmasakan', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/resepmasakan?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/jumblahhuruf', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/jumlahhuruf?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/jumblahangka', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/jumlahangka?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/random/detailhero', async (req, res, next) => {
	var text = req.query.hero
	if (!text ) return res.json(loghandler.nottext)
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/random/heroml?query=${text}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

// Stalk
router.get('/stalker/github', async (req, res, next) => {
	var username = req.query.username
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!username) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let ghstalk = await fetchJson(`https://api.github.com/users/${username}`)
	if (!ghstalk.login) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: ghstalk
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/tiktok', async (req, res, next) => {
	var username = req.query.username
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!username) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let ttstalk = await fetchJson(`https://zenzapis.xyz/stalker/tiktok?username=${username}&apikey=sonelstore`)
	if (!ttstalk.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: ttstalk.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/instagram', async (req, res, next) => {
	var username = req.query.username
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!username) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let igstalk = await fetchJson(`https://zenzapis.xyz/stalker/ig?username=${username}&apikey=sonelstore`)
	if (!igstalk.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: igstalk.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/npm', async (req, res, next) => {
	var username = req.query.username
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!username) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let npmstalk = await fetchJson(`https://registry.npmjs.org/${username}`)

	res.json({
	status: true,
	creator: `${creator}`,
	result: npmstalk
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickhago', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let hg = await fetchJson(`https://zenzapis.xyz/stalker/nickhago?apikey=sonelstore&query=${id}`)
	if (!hg.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: hg.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickccfun', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let cf = await fetchJson(`https://zenzapis.xyz/stalker/nickcocofun?apikey=sonelstore&query=${id}`)
	if (!cf.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: cf.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickbgl', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let bgl = await fetchJson(`https://zenzapis.xyz/stalker/nickbigolive?apikey=sonelstore&query=${id}`)
	if (!bgl.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: bgl.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nicknmtv', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let nmtv = await fetchJson(`https://zenzapis.xyz/stalker/nicknimotv?apikey=soneletore&query=${id}`)
	if (!nmtv.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: nmtv.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickpubg', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let pubg = await fetchJson(`https://zenzapis.xyz/stalker/nickpubg?apikey=sonelstore&query=${id}`)
	if (!pubg.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: pubg.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickff', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let ff = await fetchJson(`https://zenzapis.xyz/stalker/nickff?apikey=sonelstore&query=${id}`)
	if (!ff.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: ff.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickml', async (req, res, next) => {
	var id = req.query.id
	var zoneid = req.query.zoneid
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!zoneid) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let ml = await fetchJson(`https://zenzapis.xyz/stalker/nickml?apikey=sonelstore&query=${id}&query2=${zoneid}`)
	if (!ml.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: ml.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickmla', async (req, res, next) => {
	var id = req.query.id
	var zoneid = req.query.zoneid
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!zoneid) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let mla = await fetchJson(`https://zenzapis.xyz/stalker/nickmladventure?apikey=sonelstore&query=${id}&query2=${zoneid}`)
	if (!mla.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: mla.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nicklokapala', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let lp = await fetchJson(`https://zenzapis.xyz/stalker/nicklokapala?apikey=sonelstore&query=${id}`)
	if (!lp.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: lp.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickdomino', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let dm = await fetchJson(`https://zenzapis.xyz/stalker/nickdomino?apikey=sonelstore&query=${id}`)
	if (!dm.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: dm.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickzepeto', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let jp = await fetchJson(`https://zenzapis.xyz/stalker/nickzepeto?apikey=sonelstore&query=${id}`)
	if (!jp.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: jp.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nicksausage', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let sg = await fetchJson(`https://zenzapis.xyz/stalker/nicksausage?apikey=sonelstore&query=${id}`)
	if (!sg.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: sg.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickaov', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let aov = await fetchJson(`https://zenzapis.xyz/stalker/nickaov?apikey=sonelstore&query=${id}`)
	if (!aov.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: aov.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickcod', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let cod = await fetchJson(`https://zenzapis.xyz/stalker/nickcod?apikey=sonelstore&query=${id}`)
	if (!cod.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: cod.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/stalker/nickpb', async (req, res, next) => {
	var id = req.query.id
	var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	
	if (!id) return res.json(loghandler.notid)
	if (!apikey) return res.json(loghandler.notapikey)
	
	let pb = await fetchJson(`https://zenzapis.xyz/stalker/nickpb?apikey=sonelstore&query=${id}`)
	if (!pb.result) return res.json(loghandler.notfound)

	res.json({
	status: true,
	creator: `${creator}`,
	result: pb.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

// Short Link
router.get('/shortlink/tinyurl', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl)  

    var islink = isUrl(url)
	if (!islink ) return res.json(loghandler.noturl)  

	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

TinyUrl.shorten(url, function(url, err) {
  if (err) return res.json(loghandler.error)
	res.json({
		status: true,
		creator: `${creator}`,
		result: url
		})
});
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/shortlink/cuttly', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl) 
	
    var islink = isUrl(url)
	if (!islink ) return res.json(loghandler.noturl)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

	let randomapicuttly = apicuttly[Math.floor(Math.random() * apicuttly.length)]
	var hasil = await fetchJson(`https://cutt.ly/api/api.php?key=${randomapicuttly}&short=${url}`)
  if (!hasil.url.shortLink ) return res.json(loghandler.error)

	res.json({
		status: true,
		creator: `${creator}`,
		result: hasil.url.shortLink
		})
} else {
  res.json(loghandler.notapikey)
}
});

router.get('/shortlink/bitly', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json(loghandler.noturl) 
	
    var islink = isUrl(url)
	if (!islink ) return res.json(loghandler.noturl)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

	let randomapibitly = apibitly[Math.floor(Math.random() * apibitly.length)]
	const bitly = new BitlyClient(randomapibitly)
	bitly
	.shorten(url)
	.then(function(result) {
		res.json({
			status: true,
			creator: `${creator}`,
			result : result.link
			})
	 
	})
	.catch(function(error) {
	 res.json(loghandler.error)
	});
} else {
  res.json(loghandler.notapikey)
}
})

// Islamic
router.get('/islamic/randomimage', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://raw.githubusercontent.com/Danzzxcodes/scraper/main/islamic/random_img.json`)
	var result = data[Math.floor(Math.random() * data.length)];
	res.json({
	status: true,
	creator: `${creator}`,
	result: result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/islamic/jadwalsholat', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
	danzz.sholat()
.then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
})
.catch((err) =>{
 res.json(loghandler.error)

})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/islamic/asmaulhusna', async (req, res, next) => {
        var Apikey = req.query.apikey

	if(!Apikey) return res.json(loghandler.notparam)
	if(listkey.includes(Apikey)){

	asmaul = JSON.parse(fs.readFileSync(__path +'/data/AsmaulHusna.json'));
	res.json(asmaul)
} else {
res.json(loghandler.invalidKey)
}
})

router.get('/islamic/hadist', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/islamic/hadist`)
	if (!data.list ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.list
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/islamic/quran', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/islamic/quran`)
	if (!data.list ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.list
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/islamic/surah', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
	danzz.surah(text)
.then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
})
.catch((err) =>{
 res.json(loghandler.error)

})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/islamic/tafsirsurah', async (req, res, next) => {
	var text = req.query.text
	if (!text ) return res.json(loghandler.nottext)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.tafsirsurah(text)
.then((data) =>{ 
	if (!data[0] ) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
})
.catch((err) =>{
 res.json(loghandler.error)

})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/islamic/kisahnabi', async (req, res, next) => {
	var nabi = req.query.nabi,
		Apikey = req.query.apikey;

		if (!Apikey) return res.json(loghandler.notparam)
		if (listkey.includes(Apikey)){
		Searchnabi(nabi)
		.then(result => {
			res.json({
				creator: creator,
				result
			})
		})
		.catch(e => {
			console.log('Error :', color(e, 'red'))
			res.json(loghandler.error)
		})
	} else {
res.json(loghandler.invalidKey)
}
})

// Trending
router.get('/trending/bekasi', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/bekasi`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/depok', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/depok`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/pekanbaru', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/pekanbaru`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/surabaya', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/surabaya`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/makassar', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/makassar`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/bandung', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/bandung`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/jakarta', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/jakarta`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/medan', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/medan`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/palembang', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/palembang`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/semarang', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/semarang`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/trending/tangerang', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/trending/tangerang`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

// News
router.get('/news/inews', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/news/berita`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/news/kompas', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/news/kompas`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/news/okezone', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/news/okezone`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/news/antara', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/news/antara`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

// Information
router.get('/information/gempa', async (req, res, next) => {
	var apikey = req.query.apikey,
		Apikey = req.query.apikey;

		if (!Apikey) return res.json(loghandler.notparam)
		if (listkey.includes(Apikey)){
		Gempa()
		.then(result => {
			res.json({
				creator: creator,
				result
			})
		})
		.catch(e => {
			console.log('Error :', color(e, 'red'))
			res.json(loghandler.error)
		})
	} else {
res.json(loghandler.invalidKey)
}
})

router.get('/information/covidworld', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://api-yogipw.herokuapp.com/api/info/covidworld`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/information/postalcode', async (req, res, next) => {
	var city = req.query.city
	if (!city ) return res.json({ status : false, creator : `${creator}`, message : "Enter City"})  
	
	let data = await fetchJson(`https://api-yogipw.herokuapp.com/api/info/kodepos?kota=${city}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){

	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/information/hoax', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/information/infohoax`)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/information/jadwalbola', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/information/jadwalbola`)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/information/clock', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/information/jam`)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/information/worldclock', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://myselfff.herokuapp.com/docs/information/jamdunia`)
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/information/kbbi', async (req, res, next) => {
	var query = req.query.query
	if (!query ) return res.json(loghandler.notquery)
	
	let data = await fetchJson(`https://api-yogipw.herokuapp.com/api/info/kbbi?kata=${query}`)
	if (!data.result ) return res.json(loghandler.notfound)
	
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	res.json({
	status: true,
	creator: `${creator}`,
	result: data.result
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/information/wikipedia', async (req, res, next) => {
	var apikey = req.query.apikey,
		Apikey = req.query.apikey;

		if (!Apikey) return res.json(loghandler.notparam)
		if (listkey.includes(Apikey)){
		XeonBotIncWiki()
		.then(result => {
			res.json({
				creator: `${creator}`,
				result
			})
		})
		.catch(e => {
			console.log('Error :', color(e, 'red'))
			res.json(loghandler.error)
		})
	} else {
res.json(loghandler.invalidKey)
}
})

.catch((err) =>{
 res.json(loghandler.notfound)

})
} else {
  res.json(loghandler.notapikey)
}
})

// Primbon
router.get('/primbon/ramalanjodoh', async (req, res, next) => {
    var date = req.query.date
    var month = req.query.month
    var years = req.query.years
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!date) return res.json({ status : false, creator : `${creator}`, message : "Enter Date"})
	if(!month) return res.json({ status : false, creator : `${creator}`, message : "Enter Month"})
	if(!years) return res.json({ status : false, creator : `${creator}`, message : "Enter Years"})
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson(`https://api-yogipw.herokuapp.com/api/fun/ramaljadian?tanggal=${date}&bulan=${month}&tahun=${years}`)
	
  res.json({
	status: true,
	creator: `${creator}`,
	result: data
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/primbon/artinama', async (req, res, next) => {
    var name = req.query.name
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!name) return res.json({ status : false, creator : `${creator}`, message : "Enter Name"})
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson(`http://kocakz.herokuapp.com/api/primbon/artinama?name=${name}`)
	
  res.json({
	status: true,
	creator: `${creator}`,
	result: data
})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/primbon/tafsirmimpi', async (req, res, next) => {
    var dream = req.query.dream
    var apikey = req.query.apikey
	
	if(listkey.includes(apikey)){
	if(!dream) return res.json({ status : false, creator : `${creator}`, message : "Enter Dream"})
	if(!apikey) return res.json(loghandler.notapikey)
	
	let data = await fetchJson(`http://kocakz.herokuapp.com/api/primbon/tafsirmimpi?mimpi=${dream}`)
	
  res.json({
	status: true,
	creator: `${creator}`,
	result: data
})
} else {
  res.json(loghandler.notapikey)
}
})

// Tools
router.get('/tools/ebase64', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	var string = req.query.text
	
	if (!text ) return res.json(loghandler.nottext)
	if (text.length > 2084) return res.json({ status : false, creator : `${creator}`, message : "Maximal 2.084 String!"})
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkeyprem.includes(apikey)){
		
		res.json({
			status: true,
			creator: `${creator}`,
			result:{
				type: 'base64',
				string: string,
				encode: Buffer.from(text, 'base64').toString('ascii')
				}
		})
}
else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/tools/dbase64', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	var string = req.query.text
	
	if (!text ) return res.json(loghandler.nottext)  
	if (text.length > 2084) return res.json({ status : false, creator : `${creator}`, message : "Maximal 2.084 String!"})
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
		res.json({
			status: true,
			creator: `${creator}`,
			result:{
				type: 'base64',
				string: string,
				encode: Buffer.from(text, 'base64').toString('ascii')
				}
		})
}
else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/tools/ebase32', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	var string = req.query.text
	
	if (!text ) return res.json(loghandler.nottext)
	if (text.length > 2084) return res.json({ status : false, creator : `${creator}`, message : "Maximal 2.084 String!"})
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
		res.json({
			status: true,
			creator: `${creator}`,
			result:{
				type: 'base32',
				string: string,
				encode: Buffer.from(text, 'base64').toString('ascii')
				}
		})
}
else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/tools/dbase32', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	var string = req.query.text
	
	if (!text ) return res.json(loghandler.nottext)  
	if (text.length > 2084) return res.json({ status : false, creator : `${creator}`, message : "Maximal 2.084 String!"})
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
		
		res.json({
			status: true,
			creator: `${creator}`,
			result:{
				type: 'base32',
				string: string,
				encode: Buffer.from(text, 'base64').toString('ascii')
				}
		})
}
else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/tools/ebinary', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	var string = req.query.text
	
	if (!text ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})  
	if (text.length > 2048) return res.json({ status : false, creator : `${creator}`, message : "[!] Maximal 2.048 String!"})
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkeyprem.includes(apikey)){
		
	function encodeBinary(char) {
		return char.split("").map(str => {
			 const converted = str.charCodeAt(0).toString(2);
			 return converted.padStart(8, "0");
		}).join(" ")
	 }

		res.json({
			status: true,
			creator: `${creator}`,
			result:{
				string: string,
				encode: encodeBinary(text)
				}
		})
}
else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/tools/dbinary', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	var string = req.query.text
	
	if (!text ) return res.json(loghandler.nottext)  
	if (text.length > 2084) return res.json({ status : false, creator : `${creator}`, message : "[!] Maximal 2.084 String!"})
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkeyprem.includes(apikey)){
		
	function dcodeBinary(char) {
		return char.split(" ").map(str => String.fromCharCode(Number.parseInt(str, 2))).join("");
	 }

		res.json({
			status: true,
			creator: `${creator}`,
			result:{
				string: string,
				decode: dcodeBinary(text)
				}
		})
}
else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/tools/styletext', async (req, res, next) => {
	var text = req.query.text
	var apikey = req.query.apikey
	
	if (!text ) return res.json(loghandler.nottext)
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkeyprem.includes(apikey)){
	
	const { shortText } = require("limit-text-js")
	var text = shortText(text, 10000)
	danzz.styletext(text)
.then((data) =>{ 
	if (!data ) return res.json(loghandler.error)
  res.json({
	status: true,
	creator: `${creator}`,
	result: data
})
})
.catch((err) =>{
 res.json(loghandler.error)

})
} else {
  res.json(loghandler.notapikeyprem)
}
})

router.get('/tools/translate', async (req, res, next) => {
	var text = req.query.text
    var lang = req.query.lang
    var apikey = req.query.apikey
    
	if(listkey.includes(apikey)){
	
	if (!text) return res.json(loghandler.nottext)  
	if (!lang) return res.json({ status : false, creator : `${creator}`, message : "Please Enter Lang. View Lang In https://cloud.google.com/translate/docs/languages"})
	if (!apikey) return res.json(loghandler.notapikey)
	
	const defaultLang = 'en'
	const tld = 'cn'
	

	let result
    try {
        result = await translate(`${text}`, {
            tld,
            to: lang,
        })
    } catch (e) {
        result = await translate(`${text}`, {
            tld,
            to: defaultLang,
        })
        
    } finally {
		res.json({
			status: true,
			creator: `${creator}`,
			result: result[0]
		})
        
    }
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/tools/ssweb', async (req, res, next) => {
	var link = req.query.link
	var islink = isUrl(link)
	var apikey = req.query.apikey
	
	if (!link) return res.json(loghandler.noturl)  
	if (!islink) return res.json(loghandler.noturl)  
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	danzz.ssweb(link)
	.then((data) =>{ 
		if (!data) return res.json(loghandler.notfound)
		res.set({'Content-Type': 'image/png'})
		res.send(data)
	})
	.catch((err) =>{
	 res.json(loghandler.notfound)
	
	})
} else {
  res.json(loghandler.notapikey)
}
})

router.get('/tools/fakeaddress', async (req, res, next) => {
	var apikey = req.query.apikey
	if (!apikey) return res.json(loghandler.notapikey)
	if(listkey.includes(apikey)){
	
	let data = await fetchJson(`https://raw.githubusercontent.com/CeptiRest/Restapi/main/fake_address.json`)
	res.json({
	status: true,
	creator: `${creator}`,
	result: data
	})
} else {
  res.json(loghandler.notapikey)
}
})

module.exports = router
