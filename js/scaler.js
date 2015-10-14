var StartPlatformer = StartPlatformer || {};

StartPlatformer.getLandscapeDimensions = function(max_w, max_h) {
	//get height and width of screen some browsers return these in reverse
	var w = window.innerWidth * window.devicePixelRatio;
	var h = window.innerHeight * window.devicePixelRatio;

	//get actual w and h
	var landW = Math.max(w, h);
	var landH = Math.min(w, h);

	//Do we need to scale for width?
	if(landW > max_w) {
		var ratioW = max_w / landW;
		landW *= ratioW;
		landH *= ratioW;
	}

	//Do we need to scale for height?
	if(landH > max_h) {
		var ratioH = max_w / landW;
		landW *= ratioH
		landH *= ratioH;
	}

	return {
		w: landW,
		h: landH
	}
}