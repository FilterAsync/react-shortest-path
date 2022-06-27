export function removeAllSpaces(str) {
	if (typeof str !== 'string') {
		return '';
	}
	return str.replace(/\s/g, '');
}

export function strToCoord(str) {
	if (typeof str !== 'string') {
		return false;
	}
	if (str[0] !== '(' || str[str.length - 1] !== ')') {
		return false;
	}
	const separatorIdx = str.indexOf(',');
	if (separatorIdx === -1) {
		return false;
	}
	const x = +str.substring(1, separatorIdx);
	const y = +str.substring(1 + separatorIdx, str.length - 1);
	if (x < 0 || y < 0 || Number.isNaN(x) || Number.isNaN(y)) {
		return false;
	}
	return [x, y];
}

export function isValidMatrixStr(str) {
	if (typeof str !== 'string') {
		return false;
	}
	if (str[0] !== '[' || str[str.length - 1] !== ']') {
		return false;
	}
	let _str = str.substring(1);
	while (_str) {
		const openBracketIdx = _str.indexOf('[');
		if (openBracketIdx === -1) {
			return false;
		}
		const closeBracketIdx = _str.indexOf(']');
		let charStartIdx = openBracketIdx;
		for (let i = openBracketIdx + 1; i <= closeBracketIdx - 1; i++) {
			const char = _str[i];
			switch (true) {
				case i - charStartIdx !== 1 && char !== ',':
				case i - charStartIdx === 1 && char === ',':
				case Number.isNaN(+char) && char !== ',':
				case char !== ',' && +char !== 0 && +char !== 1:
					return false;
				case char === ',':
					charStartIdx = i;
					break;
				default:
					break;
			}
		}
		if (_str[closeBracketIdx + 1] === ']' && closeBracketIdx + 2 === _str.length) {
			break;
		}
		if (_str[closeBracketIdx + 1] !== ',') {
			return false;
		}
		_str = _str.substring(closeBracketIdx + 2);
	}
	return true;
}