import { api, readResponse, requestOptions } from "@teleb/api-client"
import { LoginFormValues } from "@teleb/validations/auth"

export async function login(payload: LoginFormValues): Promise<any> {
  const body = await readResponse(api.v1.auth.login.$post({ json: payload }, requestOptions({ method: "POST" })))
  if (body.success === false) throw new Error(body.message || "Login failed")
  return body
}

export async function logout(locale: string): Promise<void> {
  await readResponse(api.v1.auth.logout.$post(undefined, requestOptions({ locale, method: "POST" })))
}
