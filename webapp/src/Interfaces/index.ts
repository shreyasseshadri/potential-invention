export interface IUser {
	username: string,
}

export interface IAppServer {
	fetchMode: "cors" | "navigate" | "same-origin" | "no-cors" | undefined,
	apiRoot: string,
}

export interface IFolderData {
	id: string,
	type: "track" | "album" | "playlist" | "service" | "misc",
	title: string,
	description: string,
	thumb?: string
	nav?: string,
}

export interface IAppContext {
	user: IUser,
	appServer: IAppServer,
	setLoading: () => void,
	resetLoading: () => void,
}

export interface MigratorContent {
	id: string | number,
	title: string,

	[key: string]: any,
}

export interface MigratorItem {
	id: string | number,
	title: string,

	[key: string]: any,
}

export type IResourceFetcherCallback = (
	err: Error | null,
	item: IFolderData | null,
	content: Record<string, IFolderData[]> | null
) => void
