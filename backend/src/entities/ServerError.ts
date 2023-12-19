export class ServerError {
  constructor(public status: number, public message: string, public stack?: string) {}
}
