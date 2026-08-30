import type { ChurchMembership } from "@/types/auth";

export function isChurchAdmin(memberships?: ChurchMembership[]): boolean {
  if (!memberships || memberships.length === 0) return false;
  return memberships.some(
    (membership) =>
      membership.status === "APPROVED" &&
      (membership.role === "ADMIN" || membership.role === "SUPER_ADMIN"),
  );
}