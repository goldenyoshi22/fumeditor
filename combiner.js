function lta(line) {
	let a = []

	for (i = 0; i < line.split("").length; i++) {
		a.push([line.split("")[i], i / line.split("").length])
	}

	return a
}

function atl(arrhi) {
	let b = ``

	for (i = 0; i < arrhi.length; i++) {
		b += arrhi[i][0]
	}

	return b
}

function combine(a, b) {
	a = lta(a)
	b = lta(b)
	let al = a.length
	let bl = b.length
	let c = a.concat(b)
	let cl = al * bl

	while ((cl / 3) % al == 0 && (cl / 3) % bl == 0) {cl /= 3}
	while ((cl / 2) % al == 0 && (cl / 2) % bl == 0) {cl /= 2}

	let d = c.sort((function(index){
		return function(a, b){
			return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
		};
	})(1));

	let e = ``

	let count = 0

	for (count = 0; count < 1; count += (1/cl)) {
	let f = d.filter(element => element[1] == Math.round(count * cl) / cl)
		if (count <= (cl - 0.1) / cl) {
		if (f.length == 0 || f[0][0] == undefined) {
			e += `0`
		} else {
		console.log(f)
			e += (f[0][0] == "0" && f[1] != undefined ? f[1][0] : f[0][0])
		}
		}
	}

	console.log(`${d}`)

	return e
}