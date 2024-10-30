import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@lib/definitions"
import Google from "next-auth/providers/google"

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: async (profile) => {
        //fetch data from /api/users with the email
        const response = await fetch(`${process.env.NEXT_BASE_URL}/api/users/profile/${profile.email}`)
        const additionalData = await response.json()

        if(!additionalData){
          //The user does not exist in the database
          //Create a new user
        }

        console.log(additionalData)

        return {
          id: additionalData.id ?? profile.sub, // Google's user ID
          name: additionalData.first_name ?? profile.name,
          email: profile.email,
          picture: additionalData.profile_pic ?? profile.picture,
          lastName: additionalData.last_name ?? null,
          bio: additionalData.bio ?? null,
        }
      },
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        try {
          
 
          const { email, password } = await signInSchema.parseAsync(credentials)
 
 
          // logic to verify if the user exists
          const response = await fetch(`${process.env.NEXT_BASE_URL}/api/users/authUser/${email}/${password}`)
          const userInfo = await response.json()

          console.log(userInfo)
          //return the users info
          user = {
            id: userInfo.id,
            name: userInfo.first_name,
            email: userInfo.email,
            picture: userInfo.profile_pic,
            lastName: userInfo.last_name,
            bio: userInfo.bio,
          }

          user.id = user.id

 
          if (!user) {
            throw new Error("User not found.")
          }
 
          // return JSON object with the user data
          return user
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }
        }
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profilePic = user.picture || token.picture
        token.lastName = user.lastName || token.lastName
        token.userBio = user.bio || token.bio
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.profilePic = token.profilePic
        session.user.lastName = token.lastName
        session.user.userBio = token.userBio
      }
      return session;
    },
  },
});