export interface IUser {
	username: string,
}

export interface IAppServer {
	fetchMode: "cors" | "navigate" | "same-origin" | "no-cors" | undefined,
	apiRoot: string,
}

export interface IAppContext {
	user: IUser,
	appServer: IAppServer,
	setLoading: () => void,
	resetLoading: () => void,
}