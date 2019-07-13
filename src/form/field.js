import React, { useEffect } from 'react'
import { useFormContext } from './context'
import { useStoreMap } from 'effector-react'
import { createStore, clearNode } from 'effector'
import { equalsObj } from './utils'

export const Field = ({ children, name, component, calculate, ...props }) => {
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
			calc = createStore({})
			calc.on($values, (state, values) => {
				const v = {}
				calculate.target.forEach(x => {
					if (!values[x]) {
						v[x] = ''
					} else {
						v[x] = values[x]
					}
				})
				if (!equalsObj(v, state)) return v
				return state
			})
			calc.watch(x =>
				$form.__formMethods.onChange({ name, value: calculate.fn(x) })
			)
		}
		return () => {
			if (calculate && calculate.target && calculate.fn) {
				clearNode(calc, { deep: true })
			}
		}
	}, [$form, $values, calculate, name])

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

	if (component) {
		return React.createElement(component, { input, ...props })
	}
	return children({ input, ...props })
}
