import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // Get the user from database
      const user = await User.findOne({ email: session.user.email });
      // Add user id to session
      session.user.id = user._id.toString();
      return session;
    },
    async signIn({ profile }) {
      console.log("SignIn callback triggered. Profile:", profile);
      if (!profile || !profile.email) {
        console.error("SignIn callback error: Profile or email is missing.");
        return false;
      }

      try {
        await connectToDB();
        console.log("Database connected successfully.");

        // check if user already exists
        const userExists = await User.findOne({
          email: profile.email,
        });

        console.log("User exists check:", userExists ? "Yes" : "No");

        // if not, create user
        if (!userExists) {
          console.log("Creating new user...");
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
          console.log("New user created successfully.");
        }

        console.log("SignIn successful, returning true.");
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };

console.log("🔐 ENV TEST:", process.env.NEXTAUTH_URL);

