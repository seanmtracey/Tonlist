var tonlist = (function(){
	
	'use strict';
	
	var root = "http://sean.mtracey.org/stuff/tonlist/",
	path = [],
	views = [],
	audioTag,
	isPlaying,
	waiting = false,
	currentDuration,
	currentPosition,
	progress,
	hammer = new Hammer(document.getElementById("swipeArea")),
	startX = 0,
	startY = 0;
	
	function pathRequest(query){
		if(waiting == false){
			path.push(query);
			waiting = true;
			$('#loading').show();
			
			if(path.length > 1){
				var route = path.join('/');
			} else {
				var route = path[0];
			}
			
			$.ajax({type: "GET", url: root + 'listFiles.php', data: {path: route}, success: createView, error: function(e){console.log(e);}});
		}
	}
	
	function requestAlbumList(callbackFunction){
			
			if(path.length > 1){
				var route = path.join('/');
			} else {
				var route = path[0];
			}
			
			$.ajax({type: "GET", url: root + 'listFiles.php', data: {path: route}, success: callbackFunction, error: function(e){console.log(e);}});
	};
	
	var view = function(data){
		this.data = data;
		this.viewId = view.length.toString();
		this.render();
	}
	
	view.prototype.render = function(){
		this.data = JSON.parse(this.data);
		var entities = this.data.entries;
		
		var viewsLength = views.length;
		
		var viewId = "view-" + viewsLength.toString();

		if(viewsLength === 0){
			hidePop();	
		} else {
			showPop();
		}
		
		$('body').append('<div class="view" id="' + viewId + '"></div>')
		var thisView = $('#' + viewId)
		
		this.thisView = thisView;
		
		for(var i = 0; i < entities.length; i += 1){
			var thisTitle = entities[i].title;
			var thisType = entities[i].type;
			var thisCover = entities[i].artwork;
			
			var docfrag = document.createDocumentFragment();
			var li = document.createElement("li");
			li.setAttribute("data-type", thisType);
			if(thisType == "file") {
				li.setAttribute("data-filename", entities[i].filename);
				li.setAttribute("data-filepath", root + 'music/' + path.join('/') + '/' + entities[i].filename);
				li.setAttribute("data-artwork", thisCover);
				li.setAttribute("class", "accelerate");
			}
			li.textContent = thisTitle;
			li.addEventListener("click", (function(e) {
				var whichType = this.getAttribute("data-type");
				switch (whichType) {
					case "folder":
						pathRequest(this.textContent);
						break;	
					case "file":

						$('audio').remove();
						$('body').append('<audio id="playingFile" src="' + this.getAttribute('data-filepath') + '">');
						
						$('#loading').show();
						audioTag = document.getElementById('playingFile');
						audioTag.addEventListener('canplaythrough', playAudio, false);
						audioTag.load();
						
						setTimeout((function(){
							audioTag.play();
						}), 3000);
						
						$('#playingFile').attr('src', this.getAttribute("data-filepath"));
						$('#thisTrack').text(this.innerText);
						
						$('#albumCover').css({"background-image" : "url('../" + this.getAttribute("data-artwork") + "')"});
						$('#nowPlayingHeader').css({"background-image" : "url('images/overlay.png'), url('../" + this.getAttribute("data-artwork") + "')"});
						
						break
				}
			}), false);
			docfrag.appendChild(li)
			$(thisView).append(docfrag);
			
			$('.view:not(#nowOnScreen)').removeClass().addClass('view slideOffToLeft');
			$(thisView).removeClass().addClass('view slideOnFromRight');
		}
	}
	
	function createView(data){
		views.push(new view(data));
		$('#loading').hide();
		waiting = false;
	}
	
	function popView(){
		var length = views.length;
		var thisLength = length - 1;
		var popId = "#view-" + thisLength.toString();
		
		var parent = length - 2;
		var showId = "#view-" + parent.toString();
		
		if(parent == 0){
			hidePop();
		}
		
		if(length <= 1){
			return;
		}
		
		$(popId).removeClass().addClass('view slideOffToRight');
		
		setTimeout((function(){
			$(popId).remove();
		}), 500);
		
		$(showId).removeClass().addClass('view slideOnFromLeft');
		
		path.pop();
		views.pop();
		
	}
	
	function hidePop(){
		$('#popBtn').css({'margin-left' : '100%'});
	}
	
	function showPop(){
		$('#popBtn').css({'margin-left' : '2%'});
	}
	
	function playAudio(){
		audioTag.play();
		audioTag.addEventListener("ontimeupdate", function(event) {console.log(event)}, false);
		currentDuration = audioTag.duration;
		currentPosition = setInterval((function(){
			var now = audioTag.currentTime
			var progress = (now / currentDuration) * 100;
			$('#progressBar').css({'left' : progress + "%"});
		}), 1000);
		$('#loading').fadeOut();
		nowPlaying();
	}
		
	function nowPlaying(){
		$('#nowOnScreen').removeClass().addClass('view slideOnFromRight');
		
		console.log(path);
		
		requestAlbumList(function(e){
			e = JSON.parse(e);
			var albumList = e.entries;
			
			if(albumList.length > 0){
			
				var albumListFragment = document.createDocumentFragment();
				
				var ll = 0;
				
				console.log(albumListFragment);
				console.log("===>>><<<===");
				
				while(ll < albumList.length){
					
					var thisTitle = albumList[ll].title;
					var thisType = albumList[ll].type;
					var thisCover = albumList[ll].artwork;
					
					var li = document.createElement("li");
					li.setAttribute("data-filename", albumList[ll].filename);
					li.setAttribute("data-filepath", root + 'music/' + path.join('/') + '/' + albumList[ll].filename);
					li.setAttribute("data-artwork", thisCover);
					
					li.setAttribute("class", "accelerate");
					
					li.textContent = thisTitle;
					
					li.addEventListener("click", (function(e) {
						$('audio').remove();
						$('body').append('<audio id="playingFile" src="' + this.getAttribute('data-filepath') + '">');
						
						$('#loading').show();
						audioTag = document.getElementById('playingFile');
						audioTag.addEventListener('canplaythrough', playAudio, false);
						audioTag.load();
						
						setTimeout((function(){
							audioTag.play();
						}), 3000);
						
						$('#playingFile').attr('src', this.getAttribute("data-filepath"));
						$('#thisTrack').text(this.innerText);
						
						function testThis(){
							console.log("Yep");
						};
						/*
						var image = new Image();
						image.onload = function() { // always fires the event.
							$('#albumCover').css({"background-image" : image });
							$('#nowPlayingHeader').css({"background-image" : image });
						};
						image.src = root + this.getAttribute("data-artwork");
						*/
						//$('#albumCover').css({"background-image" : "url('../" + this.getAttribute("data-artwork") + "')"});
						//$('#nowPlayingHeader').css({"background-image" : "url('images/overlay.png'), url('../" + this.getAttribute("data-artwork") + "')"});
					}), false);
					albumListFragment.appendChild(li)
					
					ll += 1;
				}
				
				$('#albumList').html(albumListFragment);
				
			}
			
			console.log(albumList);
			
		});
		
		hammer.onswipe = function(event){
			switch (event.direction) {
				case "right":
					$('#nowOnScreen').removeClass().addClass('view slideOffToRight');
					hammer.onswipe = handleSwipe;
					break;
			}
		}
		
		$('#goToNowPlaying').show();
		$('#goToNowPlaying').on('click', function(){
			$('#nowOnScreen').show().removeClass().addClass('view slideOnFromRight')
			
			$('#popBtn').off();
			$('#popBtn').on('click', function(){
				$('#nowOnScreen').removeClass().addClass('view slideOffToRight');
				$('#popBtn').off();
				$('#popBtn').on('click', function(){
					tonlist.popView();
				});
			});
			
		});
		
		isPlaying = true;
		$('#popBtn').off();
		$('#popBtn').on('click', function(){
			$('#nowOnScreen').removeClass().addClass('view slideOffToRight');
			$('#popBtn').off();
			$('#popBtn').on('click', function(){
				tonlist.popView();
			});
		});
		showPop();
	}
	
	function togglePlayback(){
		if(isPlaying){
			audioTag.pause();
			clearInterval(currentPosition);
			isPlaying = false;
		} else {
			audioTag.play();
			
			currentPosition = setInterval((function(){
				var now = audioTag.currentTime
				var progress = (now / currentDuration) * 100;
				$('#progressBar').css({'left' : progress + "%"});
			}), 1000);
			
			isPlaying = true;
		}
	}
	
	function handleSwipe(evt){
		switch(evt.direction){
			case "right":
				tonlist.popView();
				break;
		}
		
	}
	
	var init = (function(){
		pathRequest();
		$('#popBtn').on('click', function(){
			alert("POP");
			tonlist.popView();
		})
		hidePop();
		
		hammer.onswipe = handleSwipe;
		
		window.scrollTo(0, 1);
	})();
	
	return{
		pathRequest : pathRequest,
		view : view,
		views : views,
		popView : popView
	}
	
})();