import React, { useEffect } from 'react'
import { useFormContext } from './context'
import { useStoreMap } from 'effector-react'
import { initInput, initMeta } from './utils'
import { useCalculate, useValidate } from './hooks'

const useField = ({ name, calculate, validate }) => {
	const { $form, $values, _methods } = useFormContext()
	const { input, meta } = useStoreMap({
		store: $form,
		keys: [name],
		fn: (form, [name]) => {
			return form[name]
				? form[name]
				: {
						input: initInput(name, _methods),
						meta: initMeta(),
				  }
		},
	})
	useEffect(() => {
		if (!meta.initial) {
			_methods._initField({ name })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	useCalculate({ calculate, input, $values })
	useValidate({ validate, _methods, $form, name })
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

	if (component) {
		return React.createElement(component, { input, meta, ...props })
	}
	return children({ input, meta, ...props })
}
