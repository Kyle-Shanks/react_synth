export const OFF = 'off';

export const keyToNoteMap = {
    'C':     65,
    'C#/Db': 66,
    'D':     67,
    'D#/Eb': 68,
    'E':     69,
    'F':     70,
    'F#/Gb': 71,
    'G':     72,
    'G#/Ab': 73,
    'A':     74,
    'A#/Bb': 75,
    'B':     76,
};

export const scaleOffsets = {
    'Major': [0, 2, 4, 5, 7, 9, 11, 12], // Ionian
    'Dorian': [0, 2, 3, 5, 7, 9, 10, 12],
    'Phrygian': [0, 1, 3, 5, 7, 8, 10, 12],
    'Lydian': [0, 2, 4, 6, 7, 9, 11, 12],
    'Mixolydian': [0, 2, 4, 5, 7, 9, 10, 12],
    'Minor': [0, 2, 3, 5, 7, 8, 10, 12], // Aeolian
    'Locrian': [0, 1, 3, 5, 6, 8, 10, 12],
};

export const selectOptions = {
    waveform: [
        {
            value: 'sine',
            path: 'M 10 25 Q 18 10 25 25 Q 32 40 40 25',
        },
        {
            value: 'triangle',
            path: 'M 10 25 L 19 16 L 31 34 L 40 25',
        },
        {
            value: 'square',
            path: 'M 10 32 L 10 18 L 25 18 L 25 32 L 40 32 L 40 18',
        },
        {
            value: 'sawtooth',
            path: 'M 10 32 L 10 18 L 25 32 L 25 18 L 40 32 L 40 18',
        },
    ],
    filter: [
        {
            value: 'lowpass',
            path: 'M 10 22 L 26 22 L 31 16 L 40 34',
        },
        {
            value: 'highpass',
            path: 'M 40 22 L 24 22 L 19 16 L 10 34',
        },
        {
            value: 'bandpass',
            path: 'M 10 34 L 15 34 L 21 16 L 29 16 L 35 34 L 40 34',
        },
        {
            value: 'notch',
            path: 'M 10 16 L 15 16 L 21 34 L 29 34 L 35 16 L 40 16',
        },
        // Need to add the filter gain knob if these are used
        // {
        //     value: 'lowshelf',
        //     path: 'M 10 34 L 20 34 L 30 16 L 40 16',
        // },
        // {
        //     value: 'highshelf',
        //     path: 'M 10 16 L 20 16 L 30 34 L 40 34',
        // },
    ],
    reverb: [
        {
            value: 'reverb1',
            path: 'M 20 20 A 8.5 5 0 1 1 30 20 A 3 2.5 0 1 1 30 30 A 8.5 5 0 1 1 20 30 A 3 2.5 0 1 1 20 20',
        },
        {
            value: 'reverb2',
            path: 'M 18 18 A 4 4 0 1 1 32 18 A 7 7 0 1 1 32 32 A 4 4 0 1 1 18 32 A 7 7 0 1 1 18 18',
        },
        {
            value: 'reverb3',
            path: 'M 20 22 A 2 2 0 1 1 30 22 A 3 1 0 1 1 30 28 A 2 2 0 1 1 20 28 A 3 1 0 1 1 20 22',
        },
        {
            value: 'reverb4',
            path: 'M 22 20 Q 25 22 28 20 A 8 8 0 1 1 28 30 Q 25 28 22 30 A 8 8 0 1 1 22 20',
        },
        {
            value: 'reverb5',
            path: 'M 22 20 A 4 4 0 1 1 28 20 A 6 6 0 1 1 28 30 A 4 4 0 1 1 22 30 A 6 6 0 1 1 22 20',
        },
        {
            value: 'reverb6',
            path: 'M 15 25 A 10 10 0 1 1 15 25.1',
        },
    ],
};