
const font_size=19.2;



var scene = [
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	},
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	},
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	},
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	},
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	},
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	},
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	},
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	},
	{
		e:lamp,
		x:-10,
		y:150,
		w:300,
		h:250,
		f:function(){
			imageMode(CENTER);
			image(e,x,y,w,h);
		}
	}
]



function drawInterior(){
	scene.forEach(e => {
		e.f();
	});
	
	
	noStroke();
	
	// wall
	fill("SandyBrown");
	rect(0,0,width,edge);
	// floor
	fill("Khaki");
	rect(0,edge,width,height-edge);
	// window
	fill("brown");
	rect(fenster.x,fenster.y,fenster.w,fenster.h);
	fill(skyColor);
	rect(fenster.x+padding,fenster.y+padding,fenster.w-(2*padding),fenster.h-(2*padding));

	//image(lamp,-10,edge-300,  imgSize/3, imgSize/2);
	image(ball, 3*width/7+10, edge-50, imgSize/9, imgSize/9)
	image(bed, 30, edge-190);
	image(bonsai, width/2, edge-200, imgSize/3, imgSize/3);
	image(desk, 3*width/5+40,edge-190, 4*imgSize/5, 2*imgSize/5);
	image(chair, 3*width/5,edge-220, imgSize/3, imgSize/2);
	//image(laptop, 1060,edge-260, imgSize/5, imgSize/8);
	//image(monitor, 930,edge-430, 3*imgSize/7, 3*imgSize/7);
	//fill(255);
	//rect(942,181,250,160);
	//image(board, 930,edge-430, 3*imgSize/7, 3*imgSize/7);
	image(shelf, width/2,height/5, imgSize/3, imgSize/4);
	image(counter, width/11,2*height/3, 3*imgSize/4, imgSize/4);
	image(wecker, width/11,2*height/3-40, imgSize/9, imgSize/8);
	
	// get light, darken room, TODO move to different function
	let c = color('hsba(180, 100%, 0%,' + 0.80*(1-season(getSunHeight())/100)+ ')');
	fill(c)
	//rect(0,0,width, height);


}