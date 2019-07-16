import React, { useEffect } from 'react'
import { useFormContext } from './context'
import { useStoreMap } from 'effector-react'

export const useFieldArray = ({ name }) => {
	// const { $form, $values, _methods } = useFormContext()
	// const fields = {
	// 	map: fn => [`${name}[0]`].map(fn),
	// 	push: () => null,
	// }
	return {
		fields: {
			map: fn => [`${name}[0]`].map(fn),
			push: () => null,
		},
	}
}

export const FieldArray = ({ children, ...props }) => {
	const { fields } = useFieldArray(props)
	return children({ fields })
}
