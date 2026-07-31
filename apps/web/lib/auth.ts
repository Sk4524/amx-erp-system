export const ROLE_ACCESS: Record<string, string[]> = {

  ADMIN: [
    "/",
    "/profile",
    "/users",
    "/employees",
    "/inventory",
    "/finance",
    "/reports",
    "/audit",
    "/notifications",
    "/sales",
    "/vendors",
    "/projects",
    "/hr",
    "/forecasting",
  ],

MANAGER: [
  "/",
  "/profile",
  "/projects",
  "/reports",
  "/forecasting",
  "/notifications",
  "/vendors",
  "/employees",
  "/hr",
],

  HR: [
    "/",
    "/profile",
    "/employees",
    "/hr",
    "/projects",
    "/notifications",
  ],

  FINANCE: [
    "/",
    "/profile",
    "/finance",
    "/reports",
    "/notifications",
  ],

  SALES: [
    "/",
    "/profile",
    "/sales",
    "/inventory",
    "/notifications",
  ],

  EMPLOYEE: [
    "/",
    "/profile",
    "/projects",
    "/notifications",
    
  ],
};
export function canAccess(
  role: string,
  path: string
) {

  const allowed =
    ROLE_ACCESS[role];

  if (!allowed) {
    return false;
  }

  const cleanPath =
    path.split("?")[0];

  return allowed.some(
    route =>
      cleanPath === route ||
      cleanPath.startsWith(
        route + "/"
      )
  );
}