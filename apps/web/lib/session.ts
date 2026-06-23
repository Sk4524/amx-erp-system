export const getToken =
  () =>
    localStorage.getItem(
      "token"
    );

export const getRole =
  () =>
    localStorage.getItem(
      "role"
    );

export const getTenantId =
  () =>
    localStorage.getItem(
      "tenantId"
    );

export const getUserId =
  () =>
    localStorage.getItem(
      "userId"
    );

export const logout =
  () => {

    localStorage.clear();

    window.location.href =
      "/login";
  };