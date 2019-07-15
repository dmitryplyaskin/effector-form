import React, { useEffect, useMemo } from 'react'
import { createStore, createEvent, clearNode } from 'effector'
import { FormCtxProvider } from './context'
import { equalsObj, initInput, initMeta, _submitError } from './utils'

const createForm = ({ initialState = {}, onSubmit, getValues, ...props }) => {
	const _initField = createEvent()

	const _onChange = createEvent()
	const _onFocus = createEvent()
	const _onBlur = createEvent()
	const _onValidate = createEvent()
	const _onMetaData = createEvent()
	const _onSubmitError = createEvent()

	const _methods = {
		_onChange,
		_onFocus,
		_onBlur,
		_onValidate,
		_onMetaData,
		_onSubmitError,
		_initField,
	}

	const _getValues = createEvent()

	const initial = {}
	Object.keys(initialState).forEach(name => {
		initial[name] = {
			meta: initMeta(true),
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
		.on(_onValidate, (state, { name, value }) => ({
			...state,
			[name]: { ...state[name], meta: { ...state[name].meta, ...value } },
		}))
		.on(_onMetaData, (state, { name, data }) => ({
			...state,
			[name]: { ...state[name], meta: { ...state[name].meta, ...data } },
		}))
		.on(_onSubmitError, _submitError)
		.on(_initField, (state, { name }) => ({
			...state,
			[name]: {
				meta: initMeta(true),
				input: initInput(name, _methods),
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
		const form = $form.getState()
		let _valid = true
		let _names = []
		Object.keys(form).forEach(name => {
			const { valid, validate } = form[name].meta
			if (validate && !valid) {
				_names.push(name)
				_valid = false
			}
		})
		if (_valid) {
			onSubmit(form)
		} else {
			_onSubmitError(_names)
		}
	}

	return { $form, handleSubmit, $values, _methods }
}

const useEffectorForm = ({ children, ...props }) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const { $form, handleSubmit, $values, _methods } = useMemo(
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
			<FormCtxProvider value={{ $form, $values, _methods }}>
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
