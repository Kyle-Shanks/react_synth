export const getNoteFromKeyCode = (keyCode, octaveMod = 0) => {
    switch (keyCode) {
        case 65: return 65 + (12 * octaveMod); break; // C   ┐
        case 87: return 66 + (12 * octaveMod); break; // C#  │
        case 83: return 67 + (12 * octaveMod); break; // D   │
        case 69: return 68 + (12 * octaveMod); break; // Eb  │
        case 68: return 69 + (12 * octaveMod); break; // E   │
        case 70: return 70 + (12 * octaveMod); break; // F   │
        case 84: return 71 + (12 * octaveMod); break; // F#  ├── The Keyboard
        case 71: return 72 + (12 * octaveMod); break; // G   │
        case 89: return 73 + (12 * octaveMod); break; // G#  │
        case 72: return 74 + (12 * octaveMod); break; // A   │
        case 85: return 75 + (12 * octaveMod); break; // Bb  │
        case 74: return 76 + (12 * octaveMod); break; // B   │
        case 75: return 77 + (12 * octaveMod); break; // C   ┘
        // a little extra for added playability
        case 79: return 78 + (12 * octaveMod); break;
        case 76: return 79 + (12 * octaveMod); break;
        case 80: return 80 + (12 * octaveMod); break;
        case 186: return 81 + (12 * octaveMod); break;
        default: return false;
    };
};

export const getFreqFromKeyCode = (keyCode, octaveMod = 0) => (
    getFreqFromNote(keyCodeToNoteMap[keyCode], octaveMod)
);
export const getFreqFromNote = (note, octaveMod = 0) => {
    while (note < 65) { note += 12; octaveMod--; }
    while (note > 77) { note -= 12; octaveMod++; }
    return noteToFreqMap[note] * Math.pow(2, octaveMod);
};

const keyCodeToNoteMap = {
    65: 65, // C   ┐
    87: 66, // C#  │
    83: 67, // D   │
    69: 68, // Eb  │
    68: 69, // E   │
    70: 70, // F   │
    84: 71, // F#  ├── The Keyboard
    71: 72, // G   │
    89: 73, // G#  │
    72: 74, // A   │
    85: 75, // Bb  │
    74: 76, // B   │
    75: 77, // C   ┘
    // a little extra for added playability
    79: 78,
    76: 79,
    80: 80,
    186: 81,
};

const noteToFreqMap = {
    65: 261.63, // C   ┐
    66: 277.18, // C#  │
    67: 293.66, // D   │
    68: 311.13, // Eb  │
    69: 329.63, // E   │
    70: 349.23, // F   │
    71: 369.99, // F#  │
    72: 392.00, // G   │
    73: 415.30, // G#  │
    74: 440.00, // A   │
    75: 466.16, // Bb  │
    76: 493.88, // B   │
    77: 523.25, // C   ┘
};

export const getMsFromBpm = bpm => (60 / bpm) * 1000;