import React, { useEffect } from 'react'
import { useFormContext } from './context'
import { useStoreMap } from 'effector-react'
import { createStore, clearNode } from 'effector'
import { equalsArray } from './utils'

export const Field = ({
	children,
	name,
	component,
	calculate,
	validate,
	...props
}) => {
	const { $form, $values } = useFormContext()
	const field = useStoreMap({
		store: $form,
		keys: [name],
		fn: (form, [name]) => {
			return form[name] ? form[name] : null
		},
	})
	useEffect(() => {
		if (!field) {
			$form.__formMethods.initField({ name })
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
						$form.__formMethods.onChange({ name, value: calculate.fn(...x) })
					} else {
						const v = gc(calculate, $values.getState())
						$form.__formMethods.onChange({ name, value: calculate.fn(...v) })
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

	const input = {
		name,
		value: field ? field.value : '',
		onChange: v =>
			$form.__formMethods.onChange({
				name,
				value: v && v.target ? v.target.value : v,
			}),
		onBlur: () => $form.__formMethods.onBlur({ name }),
		onFocus: () => $form.__formMethods.onFocus({ name }),
	}

	const error = validate ? validate(field.value) : undefined

	if (component) {
		return React.createElement(component, { input, error, ...props })
	}
	if (children) {
		return children({ input, error, ...props })
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
