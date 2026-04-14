import 'server-only'
import { getSession } from './session'

export async function requireAuth(): Promise<Record<string, unknown>> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export function withAuth<TArgs extends unknown[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs) => {
    await requireAuth()
    return action(...args)
  }
}
