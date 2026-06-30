/** Fire-and-forget client-side signup failure log for admin review. */
export async function logClientSignupFailure(params: {
  profileType: "individual" | "nonprofit";
  errorMessage: string;
  errorCode?: string;
  email?: string;
  onlineId?: string;
  firstName?: string;
  lastName?: string;
  orgName?: string;
}) {
  try {
    await fetch("/api/auth/signup/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, status: "failed" }),
    });
  } catch {
    // ignore logging failures
  }
}
