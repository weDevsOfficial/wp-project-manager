/*!
 * jQuery-runner - v2.3.0 - 2013-07-14
 * https://github.com/jylauril/jquery-runner/
 * Copyright (c) 2013 Jyrki Laurila <https://github.com/jylauril>
 */
(function() {
  var Runner, formatTime, meta, pad, runners, uid, _requestAnimationFrame, _uid;

  meta = {
    version: "2.3.0",
    name: "jQuery-runner"
  };

  runners = {};

  _uid = 1;

  pad = function(num) {
    return (num < 10 ? '0' : '') + num;
  };

  uid = function() {
    return 'runner' + _uid++;
  };

  _requestAnimationFrame = (function(win, raf) {
    return win['webkitR' + raf] || win['r' + raf] || win['mozR' + raf] || win['msR' + raf] || function(fn) {
      return setTimeout(fn, 30);
    };
  })(window, 'equestAnimationFrame');

  formatTime = function(time, settings) {
    var i, len, ms, output, prefix, separator, step, steps, value, _i, _len;
    settings = settings || {};
    steps = [3600000, 60000, 1000, 10];
    separator = ['', ':', ':', '.'];
    prefix = '';
    output = '';
    ms = settings.milliseconds;
    len = steps.length;
    value = 0;
    if (time < 0) {
      time = Math.abs(time);
      prefix = '-';
    }
    for (i = _i = 0, _len = steps.length; _i < _len; i = ++_i) {
      step = steps[i];
      value = 0;
      if (time >= step) {
        value = Math.floor(time / step);
        time -= value * step;
      }
      if ((value || i > 1 || output) && (i !== len - 1 || ms)) {
        output += (output ? separator[i] : '') + pad(value);
      }
    }
    return prefix + output;
  };

  Runner = (function() {
    function Runner(items, options, start) {
      var id;
      if (!(this instanceof Runner)) {
        return new Runner(items, options, start);
      }
      this.items = items;
      id = this.id = uid();
      this.settings = $.extend({}, this.settings, options);
      runners[id] = this;
      items.each(function(index, element) {
        $(element).data('runner', id);
      });
      this.value(this.settings.startAt);
      if (start || this.settings.autostart) {
        this.start();
      }
    }

    Runner.prototype.running = false;

    Runner.prototype.updating = false;

    Runner.prototype.finished = false;

    Runner.prototype.interval = null;

    Runner.prototype.total = 0;

    Runner.prototype.lastTime = 0;

    Runner.prototype.startTime = 0;

    Runner.prototype.lastLap = 0;

    Runner.prototype.lapTime = 0;

    Runner.prototype.settings = {
      autostart: false,
      countdown: false,
      stopAt: null,
      startAt: 0,
      milliseconds: true,
      format: null
    };

    Runner.prototype.value = function(value) {
      var _this = this;
      this.items.each(function(item, element) {
        var action;
        item = $(element);
        action = item.is('input') ? 'val' : 'text';
        item[action](_this.format(value));
      });
    };

    Runner.prototype.format = function(value) {
      var format;
      format = this.settings.format;
      format = $.isFunction(format) ? format : formatTime;
      return format(value, this.settings);
    };

    Runner.prototype.update = function() {
      var countdown, delta, settings, stopAt, time;
      if (!this.updating) {
        this.updating = true;
        settings = this.settings;
        time = $.now();
        stopAt = settings.stopAt;
        countdown = settings.countdown;
        delta = time - this.lastTime;
        this.lastTime = time;
        if (countdown) {
          this.total -= delta;
        } else {
          this.total += delta;
        }
        if (stopAt !== null && ((countdown && this.total <= stopAt) || (!countdown && this.total >= stopAt))) {
          this.total = stopAt;
          this.finished = true;
          this.stop();
          this.fire('runnerFinish');
        }
        this.value(this.total);
        this.updating = false;
      }
    };

    Runner.prototype.fire = function(event) {
      this.items.trigger(event, this.info());
    };

    Runner.prototype.start = function() {
      var step,
        _this = this;
      if (!this.running) {
        this.running = true;
        if (!this.startTime || this.finished) {
          this.reset();
        }
        this.lastTime = $.now();
        step = function() {
          if (_this.running) {
            _this.update();
            _requestAnimationFrame(step);
          }
        };
        _requestAnimationFrame(step);
        this.fire('runnerStart');
      }
    };

    Runner.prototype.stop = function() {
      if (this.running) {
        this.running = false;
        this.update();
        this.fire('runnerStop');
      }
    };

    Runner.prototype.toggle = function() {
      if (this.running) {
        this.stop();
      } else {
        this.start();
      }
    };

    Runner.prototype.lap = function() {
      var lap, last;
      last = this.lastTime;
      lap = last - this.lapTime;
      if (this.settings.countdown) {
        lap = -lap;
      }
      if (this.running || lap) {
        this.lastLap = lap;
        this.lapTime = last;
      }
      last = this.format(this.lastLap);
      this.fire('runnerLap');
      return last;
    };

    Runner.prototype.reset = function(stop) {
      var nowTime;
      if (stop) {
        this.stop();
      }
      nowTime = $.now();
      if (typeof this.settings.startAt === 'number' && !this.settings.countdown) {
        nowTime -= this.settings.startAt;
      }
      this.startTime = this.lapTime = this.lastTime = nowTime;
      this.total = this.settings.startAt;
      this.value(this.total);
      this.finished = false;
      this.fire('runnerReset');
    };

    Runner.prototype.info = function() {
      var lap;
      lap = this.lastLap || 0;
      return {
        running: this.running,
        finished: this.finished,
        time: this.total,
        formattedTime: this.format(this.total),
        startTime: this.startTime,
        lapTime: lap,
        formattedLapTime: this.format(lap),
        settings: this.settings
      };
    };

    return Runner;

  })();

  if (this.$) {
    this.$.fn.runner = function(method, options, start) {
      var id, runner;
      if (!method) {
        method = 'init';
      }
      if (typeof method === 'object') {
        start = options;
        options = method;
        method = 'init';
      }
      id = this.data('runner');
      runner = id ? runners[id] : false;
      switch (method) {
        case 'init':
          new Runner(this, options, start);
          break;
        case 'info':
          if (runner) {
            return runner.info();
          }
          break;
        case 'reset':
          if (runner) {
            runner.reset(options);
          }
          break;
        case 'lap':
          if (runner) {
            return runner.lap();
          }
          break;
        case 'start':
        case 'stop':
        case 'toggle':
          if (runner) {
            return runner[method]();
          }
          break;
        case 'version':
          return meta.version;
        default:
          $.error('[' + meta.name + '] Method ' + method + ' does not exist');
      }
      return this;
    };
    this.$.fn.runner.format = formatTime;
  } else {
    throw '[' + meta.name + '] jQuery library is required for this plugin to work';
  }

}).call(this);
