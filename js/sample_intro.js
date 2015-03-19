// Adapted from
// "Web Audio API Advanced Sound for Games and Interactive Apps"
// By Boris Smus

var samplesAllLoaded = false;

function SoundsSample(context) {

  var ctx = this;
  var loader = new BufferLoader(context, 
            ['../audios/dontOpenEye.mp3',               //#0
            '../audios/openEye.mp3',                    //#1
            '../audios/closeEye.mp3',
            '../audios/maskGuy/maskGuy_hi.mp3',         //#3
            '../audios/ins/hey.mp3',
            '../audios/IR/longAmbience.wav',
            '../audios/clockClick.mp3',                //#6
            '../audios/intro/intro_help.mp3'], onLoaded);

  function onLoaded(buffers) {
    ctx.buffers = buffers;
    // console.log(buffers);
    samplesAllLoaded = true;
  };

  loader.load();

  this.isCompressed = false;
}

SoundsSample.prototype.trigger = function(index) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = context.currentTime;

  // console.log(this.buffers);

  var source = this.makeSource(this.buffers[index]);
  source[source.start ? 'start' : 'noteOn'](time);

  // Make multiple sources using the same buffer and play in quick succession.
  // for (var i = 0; i < rounds; i++) {
  //   var source = this.makeSource(this.buffers[index]);
  //   if (random2)
  //     source.playbackRate.value = 1 + Math.random() * random2;
  //   source[source.start ? 'start' : 'noteOn'](time + i * interval + Math.random() * random);
  // }
}

SoundsSample.prototype.trigger = function(index, volume) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = context.currentTime;

  var source = this.makeSource(this.buffers[index], volume);
  source[source.start ? 'start' : 'noteOn'](time);
}

SoundsSample.prototype.makeSource = function(buffer) {
  var source = context.createBufferSource();
  var gain = context.createGain();
  gain.gain.value = 1;
  source.buffer = buffer;
  source.connect(gain);

  if (this.isCompressed) {
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = 10;
    compressor.ratio.value = 20;
    compressor.reduction.value = -20;
    gain.connect(compressor);
    compressor.connect(context.destination);
  } else {
    gain.connect(context.destination);
  }
  return source;
};

SoundsSample.prototype.makeSource = function(buffer, volume) {
  var source = context.createBufferSource();
  var gain = context.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain);

  if (this.isCompressed) {
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = 10;
    compressor.ratio.value = 20;
    compressor.reduction.value = -20;
    gain.connect(compressor);
    compressor.connect(context.destination);
  } else {
    gain.connect(context.destination);
  }
  return source;
};

SoundsSample.prototype.triggerPanner = function(index, location) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = context.currentTime;

  var source = this.makePannerSource(this.buffers[index], location);
  source[source.start ? 'start' : 'noteOn'](time);

  // Make multiple sources using the same buffer and play in quick succession.
  // for (var i = 0; i < rounds; i++) {
  //   var source = this.makeSource(this.buffers[index]);
  //   if (random2)
  //     source.playbackRate.value = 1 + Math.random() * random2;
  //   source[source.start ? 'start' : 'noteOn'](time + i * interval + Math.random() * random);
  // }
}

SoundsSample.prototype.makePannerSource = function(buffer, location) {
  var source = context.createBufferSource();
  var gain = context.createGain();
  gain.gain.value = 20;
  source.buffer = buffer;
  source.connect(gain);

  //Panner
  var panner = context.createPanner();
  gain.connect(panner);
  panner.setPosition(location.x, location.y, location.z);
  panner.connect(context.destination);

  return source;
};

SoundsSample.prototype.toggleCompressor = function() {
  this.isCompressed = !this.isCompressed;
}