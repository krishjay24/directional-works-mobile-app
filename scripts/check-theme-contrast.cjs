const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../src/theme/colors.ts'), 'utf8');

function palette(name) {
  const block = source.match(new RegExp(`export const ${name}[^=]*= \\{([^}]+)\\}`));
  assert.ok(block, `Missing ${name} palette`);
  return Object.fromEntries(
    [...block[1].matchAll(/(\w+): '(#[0-9A-Fa-f]{6})'/g)]
      .map((match) => [match[1], match[2]])
  );
}

function luminance(hex) {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

let checked = 0;
for (const name of ['darkColors', 'lightColors']) {
  const colors = palette(name);
  for (const background of ['background', 'surface', 'card']) {
    for (const foreground of ['text', 'textMuted', 'textDim', 'accent', 'error']) {
      const ratio = contrast(colors[foreground], colors[background]);
      assert.ok(ratio >= 4.5, `${name}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1`);
      checked++;
    }
  }
  const buttonRatio = contrast(colors.accentText, colors.accent);
  assert.ok(buttonRatio >= 4.5, `${name}: button text is ${buttonRatio.toFixed(2)}:1`);
  checked++;
  const selectedTabRatio = contrast(colors.accent, colors.tabSelected);
  assert.ok(selectedTabRatio >= 4.5, `${name}: selected tab icon is ${selectedTabRatio.toFixed(2)}:1`);
  checked++;
}
console.log(`${checked} dark/light theme text combinations meet WCAG AA (4.5:1).`);
