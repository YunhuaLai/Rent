"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Generate a random coordinate within a bounding box around Sydney
function randomCoordinateSydney() {
    // Approximate bounding box for Sydney (customize as needed)
    var latMin = -34.0;
    var latMax = -33.6;
    var lonMin = 150.5;
    var lonMax = 151.4;
    var lat = Math.random() * (latMax - latMin) + latMin;
    var lon = Math.random() * (lonMax - lonMin) + lonMin;
    return "".concat(lat.toFixed(6), ",").concat(lon.toFixed(6));
}
// Generate random start and end times between 9:00 AM (540) and 6:00 PM (1080)
function randomTimeBetween(startMin, endMax) {
    var start = Math.floor(Math.random() * (endMax - startMin + 1)) + startMin;
    var end = Math.floor(Math.random() * (endMax - start + 1)) + start;
    return { start: start, end: end };
}
// Create one random House object
function generateRandomHouse(index) {
    var name = "House_".concat(index + 1);
    var address = "Some Address ".concat(index + 1);
    var coordinate = randomCoordinateSydney();
    var _a = randomTimeBetween(540, 1080), start = _a.start, end = _a.end; // 540 = 9 AM, 1080 = 6 PM
    var priority = Math.floor(Math.random() * 5) + 1; // 1 to 5
    return {
        name: name,
        address: address,
        coordinate: coordinate,
        start: start,
        end: end,
        priority: priority
    };
}
// Generate N houses and write to CSV
function generateHousesCSV(count, fileName) {
    var houses = [];
    for (var i = 0; i < count; i++) {
        houses.push(generateRandomHouse(i));
    }
    // CSV header
    var header = 'name,address,coordinate,start,end,priority\n';
    // CSV rows
    var rows = houses
        .map(function (h) { return "".concat(h.name, ",").concat(h.address, ",").concat(h.coordinate, ",").concat(h.start, ",").concat(h.end, ",").concat(h.priority); })
        .join('\n');
    fs.writeFileSync(fileName, header + rows, { encoding: 'utf-8' });
}
// Generate 10 houses as an example:
generateHousesCSV(10, 'houses.csv');
