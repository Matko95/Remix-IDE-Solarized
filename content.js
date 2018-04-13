const input = document.getElementById('input');
input.classList += ' ace-solarized-dark';

let blockIndex = 0;

function checkDOMChange() {
  // check for any new element being inserted here,
  // or a particular node being modified

  const blocks = document.querySelectorAll('[class^="block_"]');
  const hslRegExp = /(\(\d{1,3}%?(,\s?\d{1,3}%?){2},\s?(1|0|0?\.\d+)\)|\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/i;
  let color, filter;
  for (let i = blockIndex; i < blocks.length; i++) {
    color = blocks[i].childNodes[0].getAttribute('style');
    if (color) {
      filter = color.match(hslRegExp)[0]
        .replace(/[\(\)\s%]/g, '')
        .split(',')
        .reduce((acc, item) => parseInt(item) + acc, 0);
      if (filter === 0) {
        blocks[i].childNodes[0].style.color = "#527979";
      }
    }
  }

  if (blocks.length !== 0) {
    blockIndex += blocks.length - blockIndex;
  }

  // call the function again after 300 milliseconds
  setTimeout(checkDOMChange, 300);
}

function getQueryParams(qs) {
  qs = qs.split('+').join(' ');

  let params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

function formatMessage(data) {
  return {
    key: 'sol:'+data.name,
    value: data.code
  }
}
try {
  let solidityData = JSON.parse(getQueryParams(window.location.toString()).par);
  let finalCommand = '';
  let data;
  for (let i = 0; i < solidityData.length; i++) {
    data = formatMessage(solidityData[i]);
    finalCommand += 'localStorage.setItem("' +data.key + '",`'+js_beautify(data.value)+'`);';
  }
  console.log(solidityData);
  console.log(finalCommand);
} catch (e) {
  console.error(e);
}



checkDOMChange();