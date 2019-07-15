import React, { useEffect } from 'react'
import { useFormContext } from './context'
import { useStoreMap } from 'effector-react'
import { createStore, clearNode } from 'effector'
import { equalsArray } from './utils'

const useField = ({ name, calculate, validate }) => {
	const { $form, $values, _initField } = useFormContext()
	const { input, meta } = useStoreMap({
		store: $form,
		keys: [name],
		fn: (form, [name]) => {
			return form[name]
				? form[name]
				: { input: { value: '', onChange: () => null }, meta: {} }
		},
	})
	useEffect(() => {
		if (!input.name) {
			_initField({ name })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
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
	}, [calculate, input.name])

	return { input, meta }
}

export const Field = ({
	children,
	name,
	component,
	calculate,
	validate,
	...props
}) => {
	const { input, meta } = useField({ name, calculate, validate })

	// const meta = {
	// 	error: validate ? validate(field.value) : undefined,
	// }

	if (component) {
		return React.createElement(component, { input, meta, ...props })
	}
	if (children) {
		return children({ input, meta, ...props })
	}
	return null
}

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
