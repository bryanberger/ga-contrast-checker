# ga-contrast-chcker

Takes a set of hex colors and get contrast values for every possible combination –
useful for finding safe color combinations with predefined colors
and includes pass/fail scores for the
[WCAG accessibility guidelines](http://www.w3.org/TR/WCAG20/#visual-audio-contrast).

## Getting Started
Clone this repo. Make sure you have Node installed.

```bash
npm install
```

## Usage
Edit the `colors.json` file with a set of hex colors to test against. Currently it tests for 4.5:1(AA) and 3:1(AA Large)
```bash
npm start
```

Check the root folder for the `contrast.html` file and open it. There is also a json and csv file in there as well.
