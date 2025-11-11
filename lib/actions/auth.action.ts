"use server";

import { headers } from "next/headers";
import { getAuth } from "../betterAuth/auth";
import { inngest } from "../inngest/ai";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}) => {
  try {
    const auth = await getAuth();
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (error: any) {
    const errorMessage =
      error?.body?.message || error?.message || "Sign up failed";
    return { success: false, error: errorMessage };
  }
};

export const signOut = async () => {
  try {
    const auth = await getAuth();
    await auth.api.signOut({ headers: await headers() });

    return { success: true };
  } catch (error) {
    console.log("Sign out failed", error);
    return { success: false, error: "Sign out failed" };
  }
};

export const signInWithEmail = async ({ email, password }) => {
  try {
    const auth = await getAuth();
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    return { success: true, data: response };
  } catch (error) {
    console.log("Sign in failed", error);
    console.log("Error details:", {
      status: error.status,
      body: error?.body,
      message: error?.message,
    });
    return {
      success: true,
      error: error?.body?.message || error?.message || "Sign In failed",
    };
  }
};
