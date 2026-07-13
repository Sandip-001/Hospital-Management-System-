"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();

    if (user) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [router]);
  return <LoginForm />;
}