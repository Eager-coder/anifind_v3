export const base_url = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:80/api"

export type ClientType = {
	ok: boolean
	message: string
	data?: object | Array<any> | any
	status?: number
	error?: unknown
}

export type Method = "GET" | "POST" | "PUT" | "DELETE"

const customFetch = (url: string, method: Method = "GET", body?: object): Promise<ClientType> => {
	return new Promise(async (resolve, reject) => {
		try {
			const response1 = await fetchWrapper(url, method, body)

			if (response1.status !== 401) {
				return resolve(response1)
			}
			const authResponse: any = await fetchWrapper("/auth/refresh-token", "POST")
			if (authResponse.ok) {
				const response2 = await fetchWrapper(url, method, body)

				resolve(response2)
			} else {
				resolve({ message: "Please log in to continue", ok: false })
			}
		} catch (error) {
			resolve({ message: "Something went wrong", ok: false })
		}
	})
}
export const fetchWrapper = async (url: string, method: string = "GET", body?: object): Promise<ClientType> => {
	try {
		const res = await fetch(base_url + url, {
			method,
			body: body && JSON.stringify(body),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})

		const json = await res.json()
		return {
			ok: res.ok,
			status: res.status,
			data: json.data,
			message: json.message,
		}
	} catch (error: any) {
		console.log(error)
		return { ok: false, ...error }
	}
}
export default customFetch
