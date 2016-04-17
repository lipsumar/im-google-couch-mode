var srcs = require('./srcs.json');
var currentIndex = Math.round(Math.random()*(srcs.length-1));
var currentTop = 0;
var imgs = [];
var speed = 3;
var cache_winHeight = document.body.clientHeight;

function next(){
	currentIndex = currentIndex+1 === srcs.length ? 0 : currentIndex+1;
	var img = new Image();
	img.onload = display;
	img.onerror = next;
	img.src = srcs[currentIndex];
}

function display(){
	var img = document.createElement('img');
	img.src = srcs[currentIndex];
	img.style.transform = 'translate3d(0,'+currentTop+'px,0)';
	img.style['-webkit-transform'] = 'translate3d(0,'+currentTop+'px,0)';
	img._cache_top = currentTop;
	document.body.appendChild(img);


	var imgHeight = img.getClientRects()[0].height;


	img._cache_height = imgHeight;
	imgs.push(img);

	currentTop+=imgHeight+20;

	oneNextSwitch = true;

	if(currentTop < cache_winHeight){
		next();
	}else{
		startAnimate();
	}


}

function animate(){

	imgs.forEach(function(img, i){

		if(img._cache_top + img._cache_height <= 0){
			document.body.removeChild(img);
			imgs.splice(i, 1);
			return;
		}

		img._cache_top-=speed;
		img.style.transform = 'translate3d(0,'+img._cache_top+'px,0)';
		img.style['-webkit-transform'] = 'translate3d(0,'+img._cache_top+'px,0)';

	});

	currentTop-=speed;

	var lastImg = imgs[imgs.length-1];
	if(lastImg && lastImg._cache_top + lastImg._cache_height <= cache_winHeight){
		oneNext();
	}
	window.requestAnimationFrame(animate);
}


var startAnimate = function(){
	animate();
	startAnimate = function(){};
};

var oneNextSwitch = true;
var oneNext = function(){
	if(oneNextSwitch){
		oneNextSwitch = false;
		next();
	}
}

next();