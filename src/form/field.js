import React, { useEffect } from 'react'
import { useFormContext } from './context'
import { useStoreMap } from 'effector-react'

export const Field = ({ children, name, component, ...props }) => {
	const ctx = useFormContext()
	const field = useStoreMap({
		store: window[ctx],
		keys: [name],
		fn: (form, [name]) => {
			return form[name] ? form[name] : null
		},
	})
	useEffect(() => {
		if (!field) {
			window[ctx].__formMethods.initField({ name })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const input = {
		name,
		value: field ? field.value : '',
		onChange: v =>
			window[ctx].__formMethods.onChange({
				name,
				value: v && v.target ? v.target.value : v,
			}),
		onBlur: () => window[ctx].__formMethods.onBlur({ name }),
		onFocus: () => window[ctx].__formMethods.onFocus({ name }),
	}
	if (component) {
		return React.createElement(component, { input, ...props })
	}
	return children({ input, ...props })
}
