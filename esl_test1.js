//
// esl-test1.js
//

var esl = require('esl');
var util = require('util');

var audio_file = [];
//
// play and get digits
// <min> <max> <tries> <timeout> <terminators> <file> <invalid_file> <var_name> <regexp> <digit_timeout>
//
audio_file[0]='1 1 3 5000 # sounds/mywav/0.wav';
audio_file[1]='1 1 3 5000 # sounds/mywav/1.wav';
audio_file[2]='1 1 3 5000 # sounds/mywav/2.wav';
audio_file[3]='1 1 3 5000 # sounds/mywav/3.wav';
audio_file[4]='1 1 3 5000 # sounds/mywav/4.wav';
audio_file[5]='1 1 3 5000 # sounds/mywav/5.wav';
audio_file[6]='1 1 3 5000 # sounds/mywav/6.wav';
audio_file[7]='1 1 3 5000 # sounds/mywav/7.wav';
audio_file[8]='1 1 3 5000 # sounds/mywav/8.wav';
audio_file[9]='1 1 3 5000 # sounds/mywav/9.wav';
audio_file[10]='1 1 3 5000 # sounds/mywav/10.wav';
audio_file[11]='1 1 3 5000 # sounds/mywav/11.wav';
audio_file[12]='1 1 3 5000 # sounds/mywav/12.wav';
audio_file[13]='1 1 3 5000 # sounds/mywav/13.wav';

var error3 = '1 1 3 5000 # sounds/mywav/error3.wav';
var welcome = '1 1 3 5000 # sounds/mywav/hello.wav';


var server = esl.createCallServer();
//var server = esl.createClient();

server.on('CONNECT', function(req, res) {

	var uri, channel_data, unique_id;

	channel_data = req.body;
	unique_id = channel_data['Unique-ID'];
	

	req.execute('answer');

	//req.execute('playback', 'sounds/mywav/hello.wav');
	
	//req.execute('play_and_get_digits', '2 5 3 7000 # sounds/mywav/hello.wav sounds/mywav/error3.wav myFoo \d+');
	req.execute('play_and_get_digits', welcome);

	req.on('DTMF', function(req) {
		
		//util.log('DTMF:'+util.inspect(req, null, null));
		
		var digit;
		var channel_data;
		channel_data = req.body;
		unique_id = channel_data['Unique-ID'];

		util.log('DTMF: unique_id='+unique_id);

		digit = channel_data['DTMF-Digit'];
		console.log('DTMF Received=' + digit);
		util.log('DTMF Received');
		if(digit==='#' || digit==='*'){
			
			req.execute('play_and_get_digits', error3);
			
			
		} else {

			var n = parseInt(digit);
			
			req.execute('play_and_get_digits', audio_file[n]);

			
		}
		
		
		return;
	});

	req.on('CHANNEL_ANSWER', function(req) {

		//util.log('CHANNEL_ANSWER:'+util.inspect(req, null, null));
		var channel_data;
		channel_data = req.body;
		unique_id = channel_data['Unique-ID'];

		util.log('CHANNEL_ANSWER: unique_id='+unique_id);
		
		return util.log('Call was answered');
	});

	req.on('CHANNEL_HANGUP', function(req) {

		//util.log('CHANNEL_HANGUP:'+util.inspect(req, null, null));
		var channel_data;
		channel_data = req.body;
		unique_id = channel_data['Unique-ID'];

		util.log('CHANNEL_HANGUP: unique_id='+unique_id);

		console.log('CHANNEL_HANGUP');
		return util.log('CHANNEL_HANGUP');
	});
	
	req.on('CHANNEL_HANGUP_COMPLETE', function(req) {
		
		///util.log('CHANNEL_HANGUP_COMPLETE:'+util.inspect(req, null, null));

		var channel_data;
		channel_data = req.body;
		unique_id = channel_data['Unique-ID'];

		util.log('CHANNEL_HANGUP_COMPLETE: unique_id='+unique_id);
		
		console.log('CHANNEL_HANGUP_COMPLETE');
		return util.log('CHANNEL_HANGUP_COMPLETE');
	});

	req.on('DISCONNECT', function(req) {

		//util.log('DISCONNECT:'+util.inspect(req, null, null));
		var channel_data;
		channel_data = req.body;
		unique_id = channel_data['Unique-ID'];

		util.log('DISCONNECT: unique_id='+unique_id);

		console.log('DISCONNECT');
		return util.log('DISCONNECT');
	})

	//util.log('CONNECT: req '+util.inspect(req, null, null));
	util.log('CONNECT: unique_id='+unique_id);
	
	return util.log('CONNECT received');

});

server.listen(9173);

