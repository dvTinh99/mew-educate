import { getCookie, createError } from 'h3'

interface TokenPayload {
  id: string
  email: string
  exp: number
}

export function getAuthUser(event: any): { id: string; email: string } | null {
  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    return null
  }

  try {
    const payload: TokenPayload = JSON.parse(Buffer.from(token, 'base64').toString())
    
    if (payload.exp < Date.now()) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
    }
  } catch {
    return null
  }
}

export function requireAuth(event: any): { id: string; email: string } {
  const user = getAuthUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  return user
}
