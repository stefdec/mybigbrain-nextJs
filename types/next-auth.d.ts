
declare module "next-auth" {
  interface User {
    id: string;
    userId: string;
    profilePic?: string;
    lastName?: string;
    bio?: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    userId: string;
    profilePic?: string;
    lastName?: string;
    userBio?: string;
  }
}
