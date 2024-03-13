import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import { signIn } from "next-auth/react";

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
      // store the user is from mongodb to session
      console.log('session before =', session);
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();
      console.log( 'session after =', session);
      return session;
      
    },
    async signIn({ profile }) {
      try {
        
        await connectToDB();
        console.log('profile =', profile);
        console.log('about to create session');
        //check if a user already exist

        const userExists = await User.findOne({
          
          email: profile.email,
        });
        console.log('userExists=', userExists);
        //if not, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log("error checking if user exists:", error.message)
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
