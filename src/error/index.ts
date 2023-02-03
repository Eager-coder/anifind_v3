export class NotFoundException extends Error {
	message: string
	constructor(message: string) {
		super(message)
		this.message = message
	}
}
export class AlreadyExistsExceprion extends Error {
	message: string
	constructor(message: string) {
		super(message)
		this.message = message
	}
}
export class InvalidDataException extends Error {
	message: string
	constructor(message: string) {
		super(message)
		this.message = message
	}
}

export class UnauthorizedException extends Error {
	message: string
	constructor(message: string) {
		super(message)
		this.message = message
	}
}
