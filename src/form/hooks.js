import { useEffect } from 'react'
import { createStore, clearNode } from 'effector'
import { equalsArray } from './utils'

const gc = (c, v) => {
	const _v = []
	c.target.forEach(x => {
		if (!v[x]) {
			_v.push('')
		} else {
			_v.push(v[x])
		}
	})
	return _v
}

export const useCalculate = ({ calculate, input, $values }) => {
	useEffect(() => {
		let calc
		if (calculate && calculate.target && calculate.fn) {
			calc = createStore([])
			calc
				.on($values, (state, values) => {
					const v = gc(calculate, values)
					if (!equalsArray(v, state)) {
						return v
					}
					return state
				})
				.watch(x => {
					if (x.length) {
						input.onChange(calculate.fn(...x))
					} else {
						const v = gc(calculate, $values.getState())
						input.onChange(calculate.fn(...v))
					}
				})
		}
		return () => {
			if (calc) {
				clearNode(calc, { deep: true })
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [calculate])
}

export const useValidate = ({ validate, _methods, $form, name }) => {
	useEffect(() => {
		let valid
		if (validate) {
			_methods._onMetaData({ name, data: { validate: true } })
			valid = $form.map(x => x[name])
			valid.watch(data => {
				const { error, touched } = data.meta
				const _error = validate(data.input.value)
				if (error !== _error && touched) {
					const valid = error ? true : false
					_methods._onValidate({ name, value: { error: _error, valid } })
				}
			})
		}
		return () => {
			if (valid) {
				clearNode(valid, { deep: true })
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validate])
}
