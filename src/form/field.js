import React, { useEffect } from 'react'
import { useFormContext } from './context'
import { useStoreMap } from 'effector-react'

export const Field = ({ children, name, component, ...props }) => {
	const $form = useFormContext()
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
