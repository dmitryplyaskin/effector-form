export const equalsObj = (f, s) => {
	let e = true
	Object.keys(f).forEach(x => {
		if (f[x] !== s[x]) {
			e = false
		}
	})
	return e
}
