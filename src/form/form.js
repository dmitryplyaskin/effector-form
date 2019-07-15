import React, { useEffect, useMemo } from 'react'
import { createStore, createEvent, clearNode } from 'effector'
import { FormCtxProvider } from './context'
import { equalsObj } from './utils'

const createForm = ({ initialState = {}, onSubmit, getValues, ...props }) => {
	const _initField = createEvent()

	const _onChange = createEvent()
	const _onFocus = createEvent()
	const _onBlur = createEvent()

	const _getValues = createEvent()

	const defParams = {
		focus: false,
		valid: false,
		touched: false,
		visited: false,
		modified: false,
	}

	const initial = {}
	Object.keys(initialState).forEach(name => {
		initial[name] = {
			meta: { ...defParams },
			input: {
				name,
				value: initialState[name],
				onChange: v =>
					_onChange({
						name,
						value: v && v.target ? v.target.value : v,
					}),
				onBlur: () => _onBlur({ name }),
				onFocus: () => _onFocus({ name }),
			},
		}
	})

	const $form = createStore(initial)
	$form
		.on(_onChange, (state, { name, value }) => ({
			...state,
			[name]: { ...state[name], input: { ...state[name].input, value } },
		}))
		.on(_onFocus, (state, { name }) => ({
			...state,
			[name]: {
				...state[name],
				meta: { ...state[name].meta, focus: true, touched: true },
			},
		}))
		.on(_onBlur, (state, { name, value }) => ({
			...state,
			[name]: { ...state[name], meta: { ...state[name].meta, focus: false } },
		}))
		.on(_initField, (state, { name }) => ({
			...state,
			[name]: {
				meta: { ...defParams },
				input: {
					name,
					value: '',
					onChange: v =>
						_onChange({
							name,
							value: v && v.target ? v.target.value : v,
						}),
					onBlur: () => _onBlur({ name }),
					onFocus: () => _onFocus({ name }),
				},
			},
		}))
		.watch(_getValues)
	const $values = createStore({})
	$values.on(_getValues, (state, values) => {
		const v = {}
		Object.keys(values).forEach(name => {
			v[name] = values[name].input.value
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

	return { $form, handleSubmit, $values, _initField }
}

const useEffectorForm = ({ children, ...props }) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const { $form, handleSubmit, $values, _initField } = useMemo(
		() => createForm(props),
		[props]
	)
	useEffect(() => {
		return () => {
			clearNode($form, { deep: true })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const EffectorForm = () => {
		return (
			<FormCtxProvider value={{ $form, $values, _initField }}>
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
