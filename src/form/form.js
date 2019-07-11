import React, { useEffect, useMemo } from 'react'
import { createStore, createEvent, clearNode } from 'effector'
import nanoid from 'nanoid'
import { FormCtxProvider } from './context'

const defParams = {
	focus: false,
	valid: false,
	touched: false,
}

const createForm = ({ initialState = {}, onSubmit, getValues, ...props }) => {
	const __id = `__${nanoid()}`
	const initField = createEvent()

	const onChange = createEvent()
	const onFocus = createEvent()
	const onBlur = createEvent()
	const initial = {}
	Object.keys(initialState).forEach(name => {
		initial[name] = {
			value: initialState[name],
			...defParams,
		}
	})

	const $form = createStore(initial)
	$form
		.on(onChange, (state, { name, value }) => ({
			...state,
			[name]: { ...state[name], value },
		}))
		.on(onFocus, (state, { name }) => ({
			...state,
			[name]: { ...state[name], focus: true, touched: true },
		}))
		.on(onBlur, (state, { name, value }) => ({
			...state,
			[name]: { ...state[name], focus: false },
		}))
		.on(initField, (state, { name }) => ({
			...state,
			[name]: { value: '', ...defParams },
		}))

	$form.__formMethods = {
		initField,
		onChange,
		onFocus,
		onBlur,
	}

	const $values = $form.map(store => {
		const values = {}
		Object.keys(store).forEach(name => {
			values[name] = store[name].value
		})
		return values
	})

	if (getValues) {
		$values.watch(getValues)
	}

	const EffectorForm = ({ children }) => {
		const handleSubmit = () => {
			onSubmit($values.getState())
		}
		return (
			<FormCtxProvider value={__id}>
				{children({ handleSubmit })}
			</FormCtxProvider>
		)
	}

	window[__id] = $form
	return { EffectorForm, __id }
}

const useEffectorForm = ({ ...props }) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const { __id, EffectorForm } = useMemo(() => createForm(props), [])
	useEffect(() => {
		return () => {
			clearNode(window[__id])
			window[__id] = undefined
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return {
		EffectorForm,
	}
}

export const Form = ({ children, ...props }) => {
	const { EffectorForm } = useEffectorForm(props)
	return <EffectorForm>{children}</EffectorForm>
}
