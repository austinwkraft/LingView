export class Video extends React.Component {
	// I/P: path, the path to the video
	// O/P: a video player
	// Status: re-written, untested
	render() {
		return <video src={this.props.path} id="video" controls controlsList="nodownload" />;
	}

	static show() {
		// Resize panels:
		// adjusted to account for page margins and tooltips panel
		var extraHeight = 108; // NavBar plus footer and margins.
		var bodyHeight = 'calc(100% - ' + extraHeight.toString() + "px)";

		var marginWidth = 40;
		var leftWidth = 'calc(40% - ' + marginWidth.toString() + 'px)';
		
		var toolTipsWidth = 290; // tooltips plus 5px margin
		var centerWidth = 'calc(60% - ' + (toolTipsWidth).toString() + 'px)';

		$('#leftPanel').css('width', leftWidth);
		$('#leftPanel').css('height', bodyHeight);
		$('#centerPanel').css('margin-left', leftWidth);
		$('#centerPanel').css('height', bodyHeight);
		$("#centerPanel").css("width", centerWidth);

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
		var extraHeight = 128; // NavBar plus footer plus audio.
		var bodyHeight = 'calc(100% - ' + extraHeight.toString() + "px)";

		$("#leftPanel").css("width", "300px");
		$("#leftPanel").css("height", bodyHeight);
		$("#centerPanel").css("height", bodyHeight);
		// edited to account for page margins
		$("#centerPanel").css("margin-left", "340px");
		$("#centerPanel").css("width", "calc(100% - 340px)");

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
