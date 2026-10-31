"use client";

import { useEffect, useState } from "react";

/** User roles in the system */
export type Role = "admin" | "staff" | "customer" | "unauthenticated";

const STORAGE_KEY = "brightloop_active_role";
const AUTH_KEY = "brightloop_authenticated";

/**
 * Get the current user's role (defaults to 'admin' in development).
 */
export function getCurrentRole(): Role {
  if (typeof window !== "undefined") {
    // Check URL query param ?role=...
    const urlParams = new URLSearchParams(window.location.search);
    const queryRole = urlParams.get("role");
    if (queryRole === "admin" || queryRole === "staff" || queryRole === "customer") {
      localStorage.setItem(STORAGE_KEY, queryRole);
      localStorage.setItem(AUTH_KEY, "true");
      return queryRole;
    }
    if (queryRole === "unauthenticated") {
      localStorage.setItem(STORAGE_KEY, "unauthenticated");
      localStorage.setItem(AUTH_KEY, "false");
      return "unauthenticated";
    }

    const isAuth = localStorage.getItem(AUTH_KEY);
    if (isAuth === "false") {
      return "unauthenticated";
    }

    const saved = localStorage.getItem(STORAGE_KEY) as Role | null;
    if (saved && (saved === "admin" || saved === "staff" || saved === "customer")) {
      return saved;
    }

    if (saved === "unauthenticated") {
      return "unauthenticated";
    }

    // If neither is set, check if authenticated was explicitly set to true
    if (localStorage.getItem(AUTH_KEY) === "true") {
      return "admin";
    }

    // Default to unauthenticated if no role/session exists in browser
    return "unauthenticated";
  }
  return "admin";
}

/**
 * Set the current user's role for testing role-based access control.
 */
export function setCurrentRole(role: Role): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, role);
    localStorage.setItem(AUTH_KEY, role === "unauthenticated" ? "false" : "true");
    window.dispatchEvent(new Event("role-change"));
  }
}

/**
 * React hook to listen for role changes.
 */
export function useCurrentRole(): Role {
  const [role, setRole] = useState<Role>("admin");

  useEffect(() => {
    setRole(getCurrentRole());

    const handleRoleChange = () => {
      setRole(getCurrentRole());
    };

    window.addEventListener("role-change", handleRoleChange);
    return () => window.removeEventListener("role-change", handleRoleChange);
  }, []);

  return role;
}

/**
 * Check if the current role is authorized for a given list of allowed roles.
 */
export function isAuthorized(allowedRoles: Role[]): boolean {
  return allowedRoles.includes(getCurrentRole());
}
