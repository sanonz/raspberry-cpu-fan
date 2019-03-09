const fs = require('fs');
const rpio = require('rpio');

const config = require('./config.json');


const TEMP_FILE = '/sys/class/thermal/thermal_zone0/temp';

let status = false;
rpio.open(config.pin, rpio.OUTPUT, rpio.LOW);
setTimeout(loop, config.interval);

function loop() {
  fs.readFile(TEMP_FILE, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const temp = ~~ (data / 1000);

    if (temp >= config.max) {
      if (!status) {
        status = true;
        rpio.write(config.pin, rpio.HIGH);
      }
    } else if (temp <= config.min) {
      if (status) {
        status = false;
        rpio.write(config.pin, rpio.LOW);
      }
    }

    setTimeout(loop, config.interval);
  });
}

// $ vcgencmd measure_temp
