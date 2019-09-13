function onInputClick() {
	value = document.getElementById("data").value
	if ("Hello world!" === value)
		document.getElementById("data").value = ""
}

function onButtonClick() {
	Pizzicato.context.resume();
	data = document.getElementById("data").value
	if (!data)
	{
		console.log("No data")
		return
	}

	document.getElementById("play_button").classList.add("pulse")

	hexData = strToHex(data)
	samplesData = hexToSamples(hexData)
	playSamples(samplesData)
}

freqs = {'0': 261.63,
		 '1': 293.66,
		 '2': 329.63,
		 '3': 349.23,
		 '4': 392.0,
		 '5': 440.0,
		 '6': 493.88,
		 '7': 523.26,
		 '8': 587.32,
		 '9': 659.26,
		 'a': 698.46,
		 'b': 784.0,
		 'c': 880.0,
		 'd': 987.75,
		 'e': 1046.50,
		 'f': 1174.60}

function strToHex(string) {
	var utf8 = unescape(encodeURIComponent(string));

	var hexData = "";
	for (var i = 0; i < utf8.length; i++) {
	    hexData += utf8.charCodeAt(i).toString(16);
	}
	return hexData
}

var zeros = new Array(3000).fill(0)

function hexToSamples(hexData) {
	samples = []
	for (var i = 0; i < hexData.length; i++) {
		freq = freqs[hexData[i]]
		samples = samples.concat(get_segment(freq))
	}

	samples = samples.concat(zeros) // remove scratch
	return samples
}

function playSamples(samples) {

	if (window.player)
		window.player.stop()

	index = 0

	var player = new Pizzicato.Sound(function(e) {

		if (index >= samples.length) {
			window.player.stop()
			document.getElementById("play_button").classList.remove("pulse")
			console.log("Done")
			return
		}

	    var output = e.outputBuffer.getChannelData(0);
	    for (var i = 0; i < e.outputBuffer.length && index < samples.length; i++)
	    {
	        output[i] = samples[index]
	    	index++;
	    }
	});

	window.player = player
	window.player.play();
}

function signalWindow(index, length) {
    return Math.sin((Math.PI * index) / (length))
}

function get_segment(freq, length = Pizzicato.context.sampleRate / 10, ampl = 1, samplerate = Pizzicato.context.sampleRate) {
    var segment = []
    console.log(freq)
    for (var i = 0; i < length; i++) {
        var sample = ampl 
        sample *= Math.sin(2 * Math.PI * freq * i / samplerate)
        sample *= signalWindow(i, length)
        segment.push(sample)
    }
    return segment
}

function onDataChange(event) {
	if (event.keyCode == 13) {
        onButtonClick();
        return;
    }
	data = document.getElementById("data").value
	console.log(data)
	if (data) {
		document.getElementById("data").classList.add("active");
		document.getElementById("play_button").classList.add("active");
	} else {
		document.getElementById("play_button").classList.remove("active");
		document.getElementById("data").classList.remove("active");
	}	
}

window.onload = function() {
	document.getElementById("data").focus();
}