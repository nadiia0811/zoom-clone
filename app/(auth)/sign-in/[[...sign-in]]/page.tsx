"use client"

import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs"; 
import { useRouter } from "next/navigation";  
import { useEffect } from "react";

const SignInPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

    useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <main className="flex justify-center items-center h-screen w-full">
      <SignIn />
    </main>
  )
}

export default SignInPage;






