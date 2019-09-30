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
		return
	}

	document.getElementById("play_button").classList.add("pulse")

	hexData = strToHex(data)
	samplesData = hexToSamples(hexData)
	playSamples(samplesData)

	ga('send', {
	  hitType: 'event',
	  eventCategory: "play",
	  eventAction: data
	});
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

var zeros = new Array(5000).fill(0)

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

	var player = new Pizzicato.Sound({
	    source: 'script',
	    options: {
	    	bufferSize: 2048,
	        audioFunction: function(e) {

				if (index >= samples.length) {
					window.player.stop()
					document.getElementById("play_button").classList.remove("pulse")
					return
				}

			    var output = e.outputBuffer.getChannelData(0);
			    for (var i = 0; i < e.outputBuffer.length && index < samples.length; i++)
			    {
			        output[i] = samples[index]
			    	index++;
			    }
	    	}
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
    for (var i = 0; i < length; i++) {
        var sample = ampl 
        sample *= Math.sin(2 * Math.PI * freq * i / samplerate)
        sample *= signalWindow(i, length)
        segment.push(sample)
    }
    return segment
}

function onDataChange(event) {
	if (event && event.keyCode == 13) {
        onButtonClick();
        return;
    }
	data = document.getElementById("data").value
	if (data) {
		document.getElementById("data").classList.add("active");
		document.getElementById("play_button").classList.add("active");
	} else {
		document.getElementById("play_button").classList.remove("active");
		document.getElementById("data").classList.remove("active");
	}	
}

window.onload = function() {
	
	const urlParams = new URLSearchParams(window.location.search);
	var lang = urlParams.get('lang');
	if (!lang)
		lang = "en"
	var message = urlParams.get('message');
	if (!message)
		message = langs[lang].default
	fillPageWithLang(lang, message)

	document.getElementById("data").focus();
}

function fillPageWithLang(lang, message){
	document.getElementById("data").placeholder = langs[lang].placeholder
	document.getElementById("data").value = message
	document.getElementById("play_button").innerText = langs[lang].button
	document.getElementById("support").innerText = langs[lang].support
	document.getElementById("support").href = langs[lang].link
	onDataChange()
}

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);