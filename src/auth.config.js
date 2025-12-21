
export const authConfig = {
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { // This is only called on sign-in
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      // Default to baseUrl for all other cases
      return baseUrl;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/error', // Add this line to point to your new error page
    // ... other custom pages
  },
  secret: process.env.NEXTAUTH_SECRET,

};
