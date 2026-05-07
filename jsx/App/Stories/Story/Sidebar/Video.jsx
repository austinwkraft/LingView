export class Video extends React.Component {
	// I/P: path, the path to the video
	// O/P: a video player
	// Status: re-written, untested
	render() {
		return <video src={this.props.path} id="video" controls controlsList="nodownload" />;
	}

	static show() {
		// Resize panels:
		var leftWidth = 'calc(40% - 40px)'; // 40% minus margins inheritedfrom content
		var leftHeight = 'calc(100% - 108px)'; // 100% minus NavBar, footer, and top margin
		var bodyHeight = 'calc(100% - 88px)'; // 100% minus NavBar and footer

		$('#leftPanel').css('width', leftWidth);
		$('#leftPanel').css('height', leftHeight); 
		$('#centerPanel').css('margin-left', leftWidth); // offset of the center panel is the width of the left panel
		$('#centerPanel').css('height', bodyHeight);
		$("#centerPanel").css("width", "60%");

		// Deactivate audio (only if the audio footer exists)
		if ($('#footer').length) {
			$('#footer').css('display', 'none');
			$('#audio').removeAttr('ontimeupdate');
			$('#audio').removeAttr('onclick');
			$('#audio').attr('data-live', 'false');
		}

		// Activate video:
		$('#video').css('display', 'block'); // switched from 'inline' because it seemed unnecessary and allowed for flickering scrollbar glitch
		$('#video').attr('data-live', 'true');
		$('#video').attr('ontimeupdate', 'sync(this.currentTime)');
		$('#video').attr('onclick', 'sync(this.currentTime)');
		// Set video width to match left panel
		$('#video').css('width', '100%');

		// Match times:
		var audio = document.getElementById('audio');
		var video = document.getElementById('video');

		if (audio) {
			if (!audio.paused) {
				audio.pause();
				video.play();
			}
			video.currentTime = audio.currentTime;
		}
		
	}

	static hide() {
		// Resize panels:
		var leftHeight = 'calc(100% - 128px)'; // 100% minus NavBar, footer, and audio player
		var bodyHeight = 'calc(100% - 88px)'; // 100% minus NavBar and footer
		var centerWidth = 'calc(100% - 360px)'; // 100% minus left panel width and margins inherited from content

		$("#leftPanel").css("width", "320px"); 
		$("#leftPanel").css("height", leftHeight);
		$("#leftPanel").css("margin-right", "20px");
		$("#centerPanel").css("height", bodyHeight);
		$("#centerPanel").css("margin-left", "320px"); // offset of the center panel is the width of the left panel
		$("#centerPanel").css("width", centerWidth);

		// Deactivate video:
		$("#video").css("display", "none");
		$("#video").removeAttr("onclick");
		$("#video").removeAttr("ontimeupdate");
		$("#video").attr("data-live", "false");

		// Activate audio (only if the audio footer exists)
		if ($('#footer').length) {
			$("#footer").css("display", "block");
			$("#audio").attr("data-live", "true");
			$("#audio").attr("ontimeupdate", "sync(this.currentTime)");
			$("#audio").attr("onclick", "sync(this.currentTime)");
		}

		// Match times:
		var audio = document.getElementById("audio");
		var video = document.getElementById("video");

		if (audio) {
			if (!video.paused) {
				video.pause();
				audio.play();
			}
			audio.currentTime = video.currentTime;
		}
		
		
	}
}
