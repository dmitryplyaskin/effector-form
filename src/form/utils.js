export const equalsObj = (f, s) => {
	let e = true
	Object.keys(f).forEach(x => {
		if (f[x] !== s[x]) {
			e = false
		}
	})
	return e
}
export const equalsArray = (f, s) => {
	let e = true
	if (f.length !== s.length) return false
	f.forEach((x, i) => {
		if (x !== s[i]) {
			e = false
		}
	})
	return e
}
