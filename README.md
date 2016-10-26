# ga-contrast-chcker

Takes a set of hex colors and get contrast values for every possible combination –
useful for finding safe color combinations with predefined colors
and includes pass/fail scores for the
[WCAG accessibility guidelines](http://www.w3.org/TR/WCAG20/#visual-audio-contrast).

## Getting Started
Install node.js version ~6.1.0

```bash
npm install
```

## Usage

Edit the colors.json file with a set of hex colors to test against. Currently it tests for 4.5:1(AA) and 3:1(AA Large) compliance
```bash
npm start
```
