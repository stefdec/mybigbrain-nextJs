import NextAuth from "next-auth"
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@lib/definitions";
import Google from "next-auth/providers/google";
import { getUserProfile } from "@lib/actions/users/users";
import { verifyUser } from "@lib/actions/auth/login";
import { registerUserFromProvider } from "@lib/actions/auth/register";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: async (profile) => {
        let user = null;
        // Fetch data from /api/users with the email
        const response = await getUserProfile(profile.email);
        const additionalData = await response.json();

        user = {
          id: profile.sub, // Google's user ID
          userId: additionalData.id,
          name: additionalData.first_name ?? profile.name,
          email: profile.email,
          picture: additionalData.profile_pic ?? profile.picture,
          lastName: additionalData.last_name ?? null,
          bio: additionalData.bio ?? null,
        };

        if (!additionalData) {
          // The user does not exist in the database - create a new user
          const response = await registerUserFromProvider(user);
          const newUser = response ? await response.json() : null;

          user.id = newUser.id;
        }

        return user;
      },
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        try {
          console.log("PRINT credentials", credentials);

          const { email, password } = await signInSchema.parseAsync(credentials);

          // Fetch user information from your API
          const response = await verifyUser(email, password);
          if (!response) {
            console.error("Wrong credentials");
            return null;
          }

          const userInfoData = await getUserProfile(email);
          const userInfo = userInfoData ? await userInfoData.json() : null;

          if (userInfo) {
            user = {
              id: userInfo.id,
              userId: userInfo.id,
              name: userInfo.first_name,
              email: userInfo.email,
              picture: userInfo.profile_pic ?? null,
              lastName: userInfo.last_name,
              bio: userInfo.bio,
            };
          } else {
            throw new Error("User not found.");
          }

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Zod validation error:", error.errors);
            return null; // Credentials are invalid
          }
          console.error("Unexpected error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.userId = user.userId;
        token.profilePic = user.picture || token.picture;
        token.lastName = user.lastName || token.lastName;
        token.userBio = user.bio || token.bio;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.userId = token.userId;
        session.user.profilePic = token.profilePic;
        session.user.lastName = token.lastName;
        session.user.userBio = token.userBio;
      }
      return session;
    },
  },
});
