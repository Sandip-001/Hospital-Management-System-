"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/config/roles";

interface RoleGuardProps {
  allowedRole: UserRole;
  children: ReactNode;
}

export default function RoleGuard({
  allowedRole,
  children,
}: RoleGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== allowedRole) {
      toast.error("You are not authorized to access this module.");

      router.replace(`/${user.role}/dashboard`);
    }
  }, [allowedRole, router]);

  const user = getCurrentUser();

  if (!user || user.role !== allowedRole) {
    return null;
  }

  return children;
}