function iterRows() {
  print('START - starting treatment');
  print(`> VARS = ${VARS}`);
  CSVA.forEach((row) => {
    print(`> row is ${row}`);
    const vals = {};
    // const to = row.shift();
    let cHTML = HTML;
    let cTEXT = TEXT;
    row.forEach((val, k) => {
      print(`VARS[k] = "${VARS[k]}", val = "${val}"`);
      vals[VARS[k]] = val;
    });
    Object.entries(vals).forEach(([i, v]) => {
      const iw = `{{${i}}}`;
      _positions(cHTML).forEach((pos) => {
        print(`> Comparing "${pos}" to "${iw}"`);
        if (pos == iw) {
          print(`> MATCH; replacing pos="${pos}" with v="${v}"`);
          cHTML = cHTML.replace(pos, v);
        }
      });
      _positions(cTEXT).forEach((pos) => {
        if (pos == iw) {
          cTEXT = cTEXT.replace(pos, v);
        }
      });
    });
    print('-------------');
    print(cHTML);
    print(cTEXT);
    print('-------------');
    MAILINGS.push({
      html: cHTML,
      text: cTEXT,
    });
  });
}

function _positions(template) {
  const re = /{{([a-zA-Z0-9_]+)}}/g;
  const res = template.match(re);
  return res;
}