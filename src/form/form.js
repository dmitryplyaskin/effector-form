import React, { useEffect, useState } from 'react'
import { createStore, createEvent, clearNode } from 'effector'
import nanoid from 'nanoid'
import { FormCtxProvider } from './context'

const defParams = {
	focus: false,
	valid: false,
	touched: false,
}

const createForm = ({ initialState = {}, id, ...props }) => {
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

	const $store = createStore(initial)
	$store
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
	// .watch(x => console.log('form', x))

	$store.__formMethods = {
		initField,
		onChange,
		onFocus,
		onBlur,
	}

	return $store
}

export const Form = ({ className, children, ...props }) => {
	const [__id, __SetId] = useState('')
	useEffect(() => {
		const id = `__${nanoid()}`
		const form = createForm({ id, ...props })
		__SetId(id)
		window[id] = form
		return () => {
			clearNode(window[id])
			window[id] = undefined
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// console.log('render')
	return (
		<FormCtxProvider value={__id}>
			{__id && <form className={className}>{children}</form>}
		</FormCtxProvider>
	)
}

// export const Form = createComponent(createForm, (props, state) => (
// 	<FormComponent {...props} {...state} />
// ))

// const FormComponent = ({ children }) => {
// 	const formRef = useRef()
// 	console.log(formRef)
// 	return <form ref={formRef}>{children}</form>
// }
