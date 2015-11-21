// Adapted from
// "Web Audio API Advanced Sound for Games and Interactive Apps"
// By Boris Smus

var samplesAllLoaded = false;

function SoundsSample(context) {

  var ctx = this;
  var loader = new BufferLoader(context, 
            ['../audios/5p/money_1.mp3',                //#0
             '../audios/5p/money_2.mp3',
             '../audios/5p/money_3.mp3',
             '../audios/5p/star_2.mp3',                //#3
             '../audios/5p/star_1.mp3',
             '../audios/5p/star_3.mp3',
             '../audios/5p/heartbeat_1.mp3',           //#6
             '../audios/5p/heartbeat_2.mp3',
             '../audios/5p/heartbeat_3.mp3',
             '../audios/5p/pbo_1.mp3',                //#9
             '../audios/5p/pbo_2.mp3',
             '../audios/5p/pbo_3.mp3',
             '../audios/5p/lightBulb_1.mp3',          //#12
             '../audios/5p/lightBulb_2.mp3',
             '../audios/5p/lightBulb_3.mp3',
             '../audios/5p/bla_1.mp3',                  //#15
             '../audios/5p/bla_2.mp3',
             '../audios/5p/bla_3.mp3',
             '../audios/5p/piano_1.mp3',             //#18
             '../audios/5p/piano_2.mp3',
             '../audios/5p/piano_3.mp3',
             '../audios/5p/f_1.mp3',            //#21
             '../audios/5p/f_2.mp3',
             '../audios/5p/f_3.mp3',
             '../audios/5p/flute_1.mp3',             //#24
             '../audios/5p/flute_2.mp3',
             '../audios/5p/flute_3.mp3',
             '../audios/5p/hmm_1.mp3',              //#27
             '../audios/5p/hmm_2.mp3',
             '../audios/5p/hmm_3.mp3'
            ], onLoaded);

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
  var time = audioContext.currentTime;

  var source = this.makeSource(this.buffers[index], volume);
  source[source.start ? 'start' : 'noteOn'](time);
}

SoundsSample.prototype.triggerReturn = function(index, volume) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = audioContext.currentTime;

  var source = this.makeSource(this.buffers[index], volume);
  source[source.start ? 'start' : 'noteOn'](time);

  return source;
}

SoundsSample.prototype.stop = function(source) {
  source.stop(audioContext.currentTime)
}

SoundsSample.prototype.makeSource = function(buffer) {
  var source = audioContext.createBufferSource();
  var gain = audioContext.createGain();
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
  var source = audioContext.createBufferSource();
  var gain = audioContext.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain);

  if (this.isCompressed) {
    var compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = 10;
    compressor.ratio.value = 20;
    compressor.reduction.value = -20;
    gain.connect(compressor);
    compressor.connect(audioContext.destination);
  } else {
    gain.connect(audioContext.destination);
  }
  return source;
};

SoundsSample.prototype.triggerPanner = function(index, location) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = audioContext.currentTime;

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
  var source = audioContext.createBufferSource();
  var gain = audioContext.createGain();
  gain.gain.value = 20;
  source.buffer = buffer;
  source.connect(gain);

  //Panner
  var panner = audioContext.createPanner();
  gain.connect(panner);
  panner.setPosition(location.x, location.y, location.z);
  panner.connect(audioContext.destination);

  return source;
};

SoundsSample.prototype.toggleCompressor = function() {
  this.isCompressed = !this.isCompressed;
}