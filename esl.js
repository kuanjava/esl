// Generated by CoffeeScript 1.3.1
(function() {
  var assert, connectionListener, eslClient, eslParser, eslResponse, eslServer, net, parse_header_text, querystring, util,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  net = require('net');

  querystring = require('querystring');

  util = require('util');

  assert = require('assert');

  exports.debug = false;

  parse_header_text = function(header_text) {
    var header_lines, headers, line, name, _fn, _i, _len, _ref;
    if (exports.debug) {
      util.log("parse_header_text(" + header_text + ")");
    }
    header_lines = header_text.split("\n");
    headers = {};
    _fn = function(line) {
      var name, value, _ref;
      _ref = line.split(/: /, 2), name = _ref[0], value = _ref[1];
      return headers[name] = value;
    };
    for (_i = 0, _len = header_lines.length; _i < _len; _i++) {
      line = header_lines[_i];
      _fn(line);
    }
    if (((_ref = headers['Reply-Text']) != null ? _ref[0] : void 0) === '%') {
      for (name in headers) {
        headers[name] = querystring.unescape(headers[name]);
      }
    }
    return headers;
  };

  eslParser = (function() {

    eslParser.name = 'eslParser';

    function eslParser(socket) {
      this.socket = socket;
      this.body_length = 0;
      this.buffer = "";
    }

    eslParser.prototype.capture_body = function(data) {
      var body;
      this.buffer += data;
      if (this.buffer.length < this.body_length) {
        return;
      }
      body = this.buffer.substring(0, this.body_length);
      this.buffer = this.buffer.substring(this.body_length);
      this.body_length = 0;
      this.process(this.headers, body);
      this.headers = {};
      return this.capture_headers('');
    };

    eslParser.prototype.capture_headers = function(data) {
      var header_end, header_text;
      this.buffer += data;
      header_end = this.buffer.indexOf("\n\n");
      if (header_end < 0) {
        return;
      }
      header_text = this.buffer.substring(0, header_end);
      this.buffer = this.buffer.substring(header_end + 2);
      this.headers = parse_header_text(header_text);
      if (this.headers["Content-Length"]) {
        this.body_length = this.headers["Content-Length"];
        return this.capture_body('');
      } else {
        this.process(this.headers);
        this.headers = {};
        return this.capture_headers('');
      }
    };

    eslParser.prototype.on_data = function(data) {
      if (exports.debug) {
        util.log("on_data(" + data + ")");
      }
      if (this.body_length > 0) {
        return this.capture_body(data);
      } else {
        return this.capture_headers(data);
      }
    };

    eslParser.prototype.on_end = function() {
      if (exports.debug) {
        util.log("Parser: end of stream");
        if (this.buffer.length > 0) {
          return util.log("Buffer is not empty, left over: " + this.buffer);
        }
      }
    };

    return eslParser;

  })();

  eslResponse = (function() {

    eslResponse.name = 'eslResponse';

    function eslResponse(socket, headers, body) {
      this.socket = socket;
      this.headers = headers;
      this.body = body;
    }

    eslResponse.prototype.register_callback = function(event, cb) {
      var _this = this;
      this.socket.removeAllListeners(event);
      return this.socket.on(event, function(res) {
        _this.socket.removeAllListeners(event);
        return cb(res);
      });
    };

    eslResponse.prototype.send = function(command, args, cb) {
      var key, value, _ref;
      if (typeof args === 'function' && !(cb != null)) {
        _ref = [args, null], cb = _ref[0], args = _ref[1];
      }
      if (exports.debug) {
        util.log(util.inspect({
          command: command,
          args: args
        }));
      }
      if (cb != null) {
        this.register_callback('esl_command_reply', cb);
      }
      try {
        this.socket.write("" + command + "\n");
        if (args != null) {
          for (key in args) {
            value = args[key];
            this.socket.write("" + key + ": " + value + "\n");
          }
        }
        return this.socket.write("\n");
      } catch (e) {
        return this.socket.emit('esl_error', {
          error: e
        });
      }
    };

    eslResponse.prototype.on = function(event, listener) {
      return this.socket.on(event, listener);
    };

    eslResponse.prototype.end = function() {
      return this.socket.end();
    };

    eslResponse.prototype.api = function(command, cb) {
      if (cb != null) {
        this.register_callback('esl_api_response', cb);
      }
      return this.send("api " + command);
    };

    eslResponse.prototype.bgapi = function(command, cb) {
      this.register_callback('esl_command_reply', function(res) {
        var r, _ref;
        r = (_ref = res.headers['Reply-Text']) != null ? _ref.match(/\+OK Job-UUID: (.+)$/) : void 0;
        return typeof cb === "function" ? cb(r[1]) : void 0;
      });
      return this.send("bgapi " + command);
    };

    eslResponse.prototype.event_json = function() {
      var cb, events, _i;
      events = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
      return this.send("event json " + (events.join(' ')), cb);
    };

    eslResponse.prototype.nixevent = function() {
      var cb, events, _i;
      events = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
      return this.send("nixevent " + (events.join(' ')), cb);
    };

    eslResponse.prototype.noevents = function(cb) {
      return this.send("noevents", cb);
    };

    eslResponse.prototype.filter = function(header, value, cb) {
      return this.send("filter " + header + " " + value, cb);
    };

    eslResponse.prototype.filter_delete = function(header, value, cb) {
      if (value != null) {
        return this.send("filter delete " + header + " " + value, cb);
      } else {
        return this.send("filter delete " + header, cb);
      }
    };

    eslResponse.prototype.sendevent = function(event_name, args, cb) {
      return this.send("sendevent " + event_name, args, cb);
    };

    eslResponse.prototype.auth = function(password, cb) {
      return this.send("auth " + password, cb);
    };

    eslResponse.prototype.connect = function(cb) {
      return this.send("connect", cb);
    };

    eslResponse.prototype.linger = function(cb) {
      return this.send("linger", cb);
    };

    eslResponse.prototype.exit = function(cb) {
      return this.send("exit", cb);
    };

    eslResponse.prototype.log = function(level, cb) {
      var _ref;
      if (typeof level === 'function') {
        _ref = [null, level], level = _ref[0], cb = _ref[1];
      }
      if (level != null) {
        return this.send("log " + level, cb);
      } else {
        return this.send("log", cb);
      }
    };

    eslResponse.prototype.nolog = function(cb) {
      return this.send("nolog", cb);
    };

    eslResponse.prototype.sendmsg_uuid = function(uuid, command, args, cb) {
      var execute_text, options;
      options = args != null ? args : {};
      options['call-command'] = command;
      execute_text = uuid != null ? "sendmsg " + uuid : 'sendmsg';
      return this.send(execute_text, options, cb);
    };

    eslResponse.prototype.sendmsg = function(command, args, cb) {
      return this.sendmsg_uuid(null, command, args, cb);
    };

    eslResponse.prototype.execute_uuid = function(uuid, app_name, app_arg, cb) {
      var options;
      options = {
        'execute-app-name': app_name,
        'execute-app-arg': app_arg
      };
      return this.sendmsg_uuid(uuid, 'execute', options, cb);
    };

    eslResponse.prototype.command_uuid = function(uuid, app_name, app_arg, cb) {
      var event;
      if (cb != null) {
        event = "CHANNEL_EXECUTE_COMPLETE " + app_name + " " + app_arg;
        this.register_callback(event, cb);
      }
      return this.execute_uuid(uuid, app_name, app_arg);
    };

    eslResponse.prototype.hangup_uuid = function(uuid, hangup_cause, cb) {
      var options;
      if (hangup_cause == null) {
        hangup_cause = 'NORMAL_UNSPECIFIED';
      }
      options = {
        'hangup-cause': hangup_cause
      };
      return this.sendmsg_uuid(uuid, 'hangup', options, cb);
    };

    eslResponse.prototype.unicast_uuid = function(uuid, args, cb) {
      return this.sendmsg_uuid(uuid, 'unicast', args, cb);
    };

    eslResponse.prototype.execute = function(app_name, app_arg, cb) {
      return this.execute_uuid(null, app_name, app_arg, cb);
    };

    eslResponse.prototype.command = function(app_name, app_arg, cb) {
      return this.command_uuid(null, app_name, app_arg, cb);
    };

    eslResponse.prototype.hangup = function(hangup_cause, cb) {
      return this.hangup_uuid(null, hangup_cause, cb);
    };

    eslResponse.prototype.unicast = function(args, cb) {
      return this.unicast_uuid(null, args, cb);
    };

    eslResponse.prototype.auto_cleanup = function() {
      var _this = this;
      this.on('esl_disconnect_notice', function(call) {
        if (exports.debug) {
          util.log("Received ESL disconnection notice");
        }
        switch (call.headers['Content-Disposition']) {
          case 'linger':
            if (exports.debug) {
              util.log("Sending esl_linger");
            }
            return _this.socket.emit('esl_linger', call);
          case 'disconnect':
            if (exports.debug) {
              util.log("Sending esl_disconnect");
            }
            return _this.socket.emit('esl_disconnect', call);
        }
      });
      this.on('esl_linger', function() {
        return _this.exit();
      });
      return this.on('esl_disconnect', function() {
        return _this.end();
      });
    };

    return eslResponse;

  })();

  connectionListener = function(socket) {
    var parser;
    socket.setEncoding('ascii');
    parser = new eslParser(socket);
    socket.on('data', function(data) {
      return parser.on_data(data);
    });
    socket.on('end', function() {
      return parser.on_end();
    });
    socket.on('CHANNEL_EXECUTE_COMPLETE', function(res) {
      var application, application_data;
      application = res.body['Application'];
      application_data = res.body['Application-Data'];
      return socket.emit("CHANNEL_EXECUTE_COMPLETE " + application + " " + application_data, res);
    });
    parser.process = function(headers, body) {
      var event, n, res, _i, _len, _ref;
      if (exports.debug) {
        util.log(util.inspect({
          headers: headers,
          body: body
        }));
      }
      switch (headers['Content-Type']) {
        case 'auth/request':
          event = 'esl_auth_request';
          break;
        case 'command/reply':
          event = 'esl_command_reply';
          if (headers['Event-Name'] === 'CHANNEL_DATA') {
            body = headers;
            headers = {};
            _ref = ['Content-Type', 'Reply-Text', 'Socket-Mode', 'Control'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              n = _ref[_i];
              headers[n] = body[n];
              delete body[n];
            }
          }
          break;
        case 'text/event-json':
          try {
            body = JSON.parse(body);
          } catch (error) {
            util.log("JSON " + error + " in " + body);
            return;
          }
          event = body['Event-Name'];
          break;
        case 'text/event-plain':
          body = parse_header_text(body);
          event = body['Event-Name'];
          break;
        case 'log/data':
          event = 'esl_log_data';
          break;
        case 'text/disconnect-notice':
          event = 'esl_disconnect_notice';
          break;
        case 'api/response':
          event = 'esl_api_response';
          break;
        default:
          event = headers['Content-Type'];
      }
      res = new eslResponse(socket, headers, body);
      if (exports.debug) {
        util.log(util.inspect({
          event: event,
          res: res
        }));
      }
      return socket.emit(event, res);
    };
    return socket.emit('esl_connect', new eslResponse(socket));
  };

  eslServer = (function(_super) {

    __extends(eslServer, _super);

    eslServer.name = 'eslServer';

    function eslServer(requestListener) {
      this.on('connection', function(socket) {
        socket.on('esl_connect', requestListener);
        return connectionListener(socket);
      });
      eslServer.__super__.constructor.call(this);
    }

    return eslServer;

  })(net.Server);

  exports.createCallServer = function() {
    var server;
    server = new eslServer(function(call) {
      var Unique_ID;
      Unique_ID = 'Unique-ID';
      return call.connect(function(call) {
        var unique_id;
        unique_id = call.body[Unique_ID];
        call.auto_cleanup();
        return call.filter(Unique_ID, unique_id, function() {
          return call.event_json('ALL', function() {
            return server.emit('CONNECT', call);
          });
        });
      });
    });
    return server;
  };

  eslClient = (function(_super) {

    __extends(eslClient, _super);

    eslClient.name = 'eslClient';

    function eslClient() {
      this.on('connect', function() {
        return connectionListener(this);
      });
      eslClient.__super__.constructor.call(this);
    }

    return eslClient;

  })(net.Socket);

  exports.createClient = function() {
    return new eslClient();
  };

}).call(this);
