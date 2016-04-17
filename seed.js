var fetchUrl = require('fetch').fetchUrl,
	fs = require('fs');
var tumblr = 'http://dinakelberman.tumblr.com/';
var currentPage = 1;
var imgRegex = /<img src="([^"]+)" alt="" style="opacity: 1;" \/>/gm;
var videoRegex = /www\.youtube\.com\/embed\/([^\?"]+)\?feature/gm;
var srcs = [];

function fetchPage(){

	var url = tumblr + (currentPage === 1 ? '' : 'page/'+currentPage);
	console.log('fetching '+url+'...');
	fetchUrl(url, function(err, meta, body){
		if(err) throw err;
		var html = body.toString();
		var m,imgCount=0;
		while ((m = imgRegex.exec(html)) !== null) {
			if (m.index === imgRegex.lastIndex) {
				imgRegex.lastIndex++;
			}
			srcs.push(m[1]);
			imgCount++;
		}


		while ((m = videoRegex.exec(html)) !== null) {
			if (m.index === videoRegex.lastIndex) {
				videoRegex.lastIndex++;
			}
			console.log('http://img.youtube.com/vi/'+m[1]+'/hqdefault.jpg');
			srcs.push('http://img.youtube.com/vi/'+m[1]+'/hqdefault.jpg');
			imgCount++;
		}


		console.log('found '+imgCount+' images. Total: '+srcs.length);
		if(imgCount){
			currentPage++;
			fetchPage();
		}else{
			console.log('writing srcs.json');
			fs.writeFile('srcs.json', JSON.stringify(srcs));
		}
	});
}


fetchPage();

