import React, { useEffect, useMemo } from 'react'
import { createStore, createEvent, clearNode } from 'effector'
import { FormCtxProvider } from './context'
import { equalsObj } from './utils'

const defParams = {
	focus: false,
	valid: false,
	touched: false,
}

const createForm = ({ initialState = {}, onSubmit, getValues, ...props }) => {
	const initField = createEvent()

	const onChange = createEvent()
	const onFocus = createEvent()
	const onBlur = createEvent()

	const __getValues = createEvent()

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
		.watch(__getValues)

	$form.__formMethods = {
		initField,
		onChange,
		onFocus,
		onBlur,
	}

	const $values = createStore({})
	$values.on(__getValues, (state, values) => {
		const v = {}
		Object.keys(values).forEach(name => {
			v[name] = values[name].value
		})
		if (!equalsObj(v, state)) return v
		return state
	})

	if (getValues) {
		$values.watch(getValues)
	}

	const handleSubmit = () => {
		onSubmit($values.getState())
	}

	return { $form, handleSubmit, $values }
}

const useEffectorForm = ({ children, ...props }) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const { $form, handleSubmit, $values } = useMemo(() => createForm(props), [])
	useEffect(() => {
		return () => {
			clearNode($form, { deep: true })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const EffectorForm = () => {
		return (
			<FormCtxProvider value={{ $form, $values }}>
				{children({ handleSubmit })}
			</FormCtxProvider>
		)
	}

	return {
		EffectorForm,
	}
}

export const Form = ({ ...props }) => {
	const { EffectorForm } = useEffectorForm(props)
	return <EffectorForm />
}
