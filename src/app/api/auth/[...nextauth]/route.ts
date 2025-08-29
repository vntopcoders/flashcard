import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'
import type { 
  Adapter, 
  AdapterUser, 
  AdapterAccount, 
  AdapterSession 
} from 'next-auth/adapters'

// Create custom Supabase client with proper configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
)

// Custom database adapter
const customAdapter: Adapter = {
  async createUser(user: Omit<AdapterUser, 'id'>) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) return null
    return data
  },

  async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*, users(*)')
      .eq('provider', provider)
      .eq('providerAccountId', providerAccountId)
      .single()

    if (error) return null
    return data?.users
  },

  async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async linkAccount(account: AdapterAccount) {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async createSession(session: { sessionToken: string; userId: string; expires: Date }) {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires.toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return {
      ...data,
      expires: new Date(data.expires)
    }
  },

  async getSessionAndUser(sessionToken: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, users(*)')
      .eq('sessionToken', sessionToken)
      .single()

    if (error) return null
    if (!data.users) return null

    return {
      session: {
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: new Date(data.expires),
      },
      user: data.users,
    }
  },

  async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>) {
    const { data, error } = await supabase
      .from('sessions')
      .update({ expires: session.expires?.toISOString() })
      .eq('sessionToken', session.sessionToken)
      .select()
      .single()

    if (error) throw error
    return {
      ...data,
      expires: new Date(data.expires)
    }
  },

  async deleteSession(sessionToken: string) {
    await supabase
      .from('sessions')
      .delete()
      .eq('sessionToken', sessionToken)
  },
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  adapter: customAdapter,
  session: {
    strategy: 'database'
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as { id: string }).id = token.sub
      }
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
})

export { handler as GET, handler as POST }