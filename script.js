const fs = require('fs');

const newData = JSON.parse(fs.readFileSync('data/prayer-sessions.json', 'utf8'));
const oldData = JSON.parse(fs.readFileSync('data/old-prayer-sessions.json', 'utf8'));

function extractPostalCode(str) {
    const match = str.match(/\b(\d{6})\b/);
    return match ? match[1] : null;
}

// Build a map of postal code -> coordinates from old data
const postalToCoords = {};
oldData.forEach(entry => {
    const code = extractPostalCode(entry.locationName);
    if (code && entry.coordinates) {
        postalToCoords[code] = entry.coordinates;
    }
});

// Update Qaryah records in new data
newData.forEach(entry => {
    if (entry.type && entry.type.toLowerCase() === 'qaryah') {
        const code = extractPostalCode(entry.locationName);
        if (code && postalToCoords[code]) {
            entry.coordinates = postalToCoords[code];
        }
    }
});

fs.writeFileSync('data/prayer-sessions.json', JSON.stringify(newData, null, 2));
console.log('Qaryah coordinates updated!');