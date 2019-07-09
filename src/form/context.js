import React from 'react'

export const FormCtx = React.createContext('')
export const FormCtxProvider = FormCtx.Provider
export const FormCtxConsumer = FormCtx.Consumer

export const useFormContext = () => {
	const formCtx = React.useContext(FormCtx)
	return formCtx
}
