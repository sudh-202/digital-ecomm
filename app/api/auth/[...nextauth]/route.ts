import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// This would typically come from your database
const ADMIN_USER = {
  id: '1',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  // In production, this would be a hashed password stored in your database
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: 'admin'
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        // In production, you would fetch the user from your database
        if (credentials.email === ADMIN_USER.email) {
          // For development, we're using a simple password comparison
          // In production, use bcrypt.compare with hashed passwords
          if (credentials.password === ADMIN_USER.password) {
            return {
              id: ADMIN_USER.id,
              email: ADMIN_USER.email,
              role: ADMIN_USER.role,
            };
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
