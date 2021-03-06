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

export const initInput = (name, methods) => {
	return {
		value: '',
		name,
		onChange: v =>
			methods._onChange({
				name,
				value: v && v.target ? v.target.value : v,
			}),
		onBlur: () => methods._onBlur({ name }),
		onFocus: () => methods._onFocus({ name }),
	}
}

export const initMeta = (inited = false) => {
	return {
		focus: false,
		valid: false,
		validate: false,
		touched: false,
		error: undefined,
		visited: false,
		modified: false,
		initial: inited,
	}
}

export const _submitError = (state, names) => {
	const newState = { ...state }
	names.forEach(name => {
		newState[name] = {
			...newState[name],
			meta: {
				...newState[name].meta,
				touched: true,
			},
		}
	})
	return newState
}
