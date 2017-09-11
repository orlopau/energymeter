'use strict';

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const ip_tools = require('ip');
const events = require('events');

const HOST = ip_tools.address();
const EM_MULTICAST_IP = '239.12.255.254';
const EM_MULTICAST_PORT = 9522;


const eventEmitter = new events.EventEmitter();
module.exports = eventEmitter;

socket.on('error', (err) => {
    console.log('Socket Error: ' + err);
    socket.close();
});

socket.on('message', (msg, rinfo) => {
    let data = {};

    data.sum = {};
    data.sum.draw = roundToTwo(msg.readUInt32BE(32) * 0.1);
    data.sum.feed = roundToTwo(msg.readUInt32BE(52) * 0.1);

    data.p1 = {};
    data.p1.draw = roundToTwo(msg.readUInt32BE(160) * 0.1);
    data.p1.feed = roundToTwo(msg.readUInt32BE(180) * 0.1);
    data.p1.voltage = roundToTwo(msg.readUInt32BE(288) / 1000);

    data.p2 = {};
    data.p2.draw = roundToTwo(msg.readUInt32BE(304) * 0.1);
    data.p2.feed = roundToTwo(msg.readUInt32BE(324) * 0.1);
    data.p2.voltage = roundToTwo(msg.readUInt32BE(432) / 1000);

    data.p3 = {};
    data.p3.draw = roundToTwo(msg.readUInt32BE(448) * 0.1);
    data.p3.feed = roundToTwo(msg.readUInt32BE(468) * 0.1);
    data.p3.voltage = roundToTwo(msg.readUInt32BE(576) / 1000);

    eventEmitter.emit('data', data);
});

socket.on('listening', () => {
    console.log('Energymeter listening at ' + HOST);
    socket.setBroadcast(true);
    socket.setMulticastTTL(128);
    socket.addMembership(EM_MULTICAST_IP, HOST);
});

socket.bind(EM_MULTICAST_PORT, HOST);

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}