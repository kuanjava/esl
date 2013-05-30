//
// esl_ivr1.js
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
var B1 = '1 1 3 5000 # sounds/mywav/B1.wav';
var B2 = '1 1 3 5000 # sounds/mywav/B2.wav';
var B3 = '1 1 3 5000 # sounds/mywav/B3.wav';
var B4 = '1 1 3 5000 # sounds/mywav/B4.wav';
var B5 = '1 1 3 5000 # sounds/mywav/B5.wav';
var B6 = '1 1 3 5000 # sounds/mywav/B6.wav';
var B7 = '1 1 3 5000 # sounds/mywav/B7.wav';
var B8 = '1 1 3 5000 # sounds/mywav/B8.wav';
var B9 = '1 1 3 5000 # sounds/mywav/B9.wav';
var B0 = '1 1 3 5000 # sounds/mywav/B0.wav';

var action_1 = 'myFoo=hello';
var action_9 = 'ringback=${us-ring}'; 
var action_bb = 'sofia/$${domain}/7609@192.168.0.127';

//state machine
var ivr_states = [ {
	'name' : 'welcome',
	'initial' : true,
	'audio' : welcome,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
}, {
	'name' : 'B1',
	'audio' : B1,
	'action': action_1,
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
}, {
	'name' : 'B2',
	'audio' : B2,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
},{
	'name' : 'B3',
	'audio' : B3,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
}, {
	'name' : 'B4',
	'audio' : B4,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
},{
	'name' : 'B5',
	'audio' : B5,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
},{
	'name' : 'B6',
	'audio' : B6,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
},{
	'name' : 'B7',
	'audio' : B7,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
},{
	'name' : 'B8',
	'audio' : B8,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
},{
	'name' : 'B9',
	'audio' : B9,
	'action': action_9,
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'BB',
		'0' : 'B0',
		'*' : 'welcome'
	}
},{
	'name' : 'B0',
	'audio' : B0,
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'B1',
		'2' : 'B2',
		'3' : 'B3',
		'4' : 'B4',
		'5' : 'B5',
		'6' : 'B6',
		'7' : 'B7',
		'8' : 'B8',
		'9' : 'B9',
		'0' : 'B0',
		'*' : 'welcome'
	}
},{
	'name' : 'BB',
	'audio' : '',
	'action':'',
	'bridge' : action_bb,
	'next' : {
		'1' : 'END',
		'2' : 'END',
		'3' : 'END',
		'4' : 'END',
		'5' : 'END',
		'6' : 'END',
		'7' : 'END',
		'8' : 'END',
		'9' : 'END',
		'0' : 'END',
		'*' : 'END'
	}
},{
	'name' : 'END',
    'audio':'',
	'action':'',
	'bridge':'',
	'next' : {
		'1' : 'END',
		'2' : 'END',
		'3' : 'END',
		'4' : 'END',
		'5' : 'END',
		'6' : 'END',
		'7' : 'END',
		'8' : 'END',
		'9' : 'END',
		'0' : 'END',
		'*' : 'END',
		'#' : 'welcome'
	}
},  



];


function StateMachine(states) {
	
	///console.log(states);
	
	this.ivr_states = states;
	this.indexes = {}; // just for convinience
	for ( var i = 0; i < this.ivr_states.length; i++) {
		this.indexes[this.ivr_states[i].name] = i;
		if (this.ivr_states[i].initial) {
			this.currentState = this.ivr_states[i];
		}
	}
	this.consumeEvent = function(e) {
		if (this.currentState.next[e]) {
			this.currentState = this.ivr_states[this.indexes[this.currentState.next[e]]];
		}
	}
	this.getStatus = function() {
		//console.log(this.currentState.name);
		util.log(''+this.currentState.name);
		return this.currentState.name;
	}
	this.getAudio = function() {
		//console.log(this.currentState.audio);
		util.log(''+this.currentState.audio);
		return this.currentState.audio;
	}
	this.getAction = function() {
		//console.log(this.currentState.audio);
		util.log(''+this.currentState.action);
		return this.currentState.action;
	}
	this.getBridge = function() {
		//console.log(this.currentState.bridge);
		util.log(''+this.currentState.bridge);
		return this.currentState.bridge;
	}

}




var server = esl.createCallServer();
//var server = esl.createClient();

server.on('CONNECT', function(req, res) {

	var uri, channel_data, unique_id;

	channel_data = req.body;
	unique_id = channel_data['Unique-ID'];
	

	req.execute('answer');

	//req.execute('playback', 'sounds/mywav/hello.wav');
	
	//req.execute('play_and_get_digits', '2 5 3 7000 # sounds/mywav/hello.wav sounds/mywav/error3.wav myFoo \d+');
	//req.execute('play_and_get_digits', welcome);
	
	var sm = new StateMachine(ivr_states);
	var str = ''; 
		
	str = sm.getStatus(); // will return 'welcome'
	if(str!==null && str!=='undefined' && str!==''){

		req.execute('play_and_get_digits', sm.getAudio());
		
	} 
	

	req.on('DTMF', function(req) {
		
		//util.log('DTMF:'+util.inspect(req, null, null));
		
		var digit;
		var channel_data;
		channel_data = req.body;
		unique_id = channel_data['Unique-ID'];

		util.log('DTMF: unique_id='+unique_id);

		digit = channel_data['DTMF-Digit'];
		///console.log('DTMF Received=' + digit);
		util.log('DTMF Received=' + digit);
		util.log('DTMF Received');
		
		sm.consumeEvent(digit);
		str = sm.getStatus(); // I went for coffee
		if(str!==null && str!=='undefined' && str!==''){

			var aud = sm.getAudio();
			if(aud!==null && aud!=='undefined' && aud!==''){
				req.execute('play_and_get_digits', sm.getAudio());
			}

			var act = sm.getAction();
			if(act!==null && act!=='undefined' && act!==''){
				req.execute('set', sm.getAction());
			}
			
			var bri = sm.getBridge();
			if(bri!==null && bri!=='undefined' && bri!==''){
				req.execute('bridge', sm.getBridge());
			}
			
			
		} 
		
		

/*		
		if(digit==='#' || digit==='*'){
			
			req.execute('play_and_get_digits', error3);

			
			
		} else {

			var n = parseInt(digit);
			
			req.execute('play_and_get_digits', audio_file[n]);

			
		}
*/
		
		
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

