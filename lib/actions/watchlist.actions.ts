"use server";

import { Watchlist } from "@/database/models/watchlist.model";
import { connectToDB } from "@/database/mongoose";
import { getAuth } from "../betterAuth/auth";
import { headers } from "next/headers";

export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    // Better Auth stores users in the "user" collection
    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

export async function toggleWatchList(
  symbol: string,
  company: string,
  isInWatchlist: boolean
) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "Please sign in" };
  }

  try {
    const mongoose = await connectToDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db
      .collection("user")
      .findOne({ email: session.user.email });
    if (!user) return { success: false, message: "Removed from watchlist" };

    if (!symbol || !company) {
      return { success: false, error: "Invalid data" };
    }

    const userId = user._id.toString();
    const upperSymbol = symbol.toUpperCase();

    if (isInWatchlist) {
      await Watchlist.findOneAndDelete({ userId, symbol: upperSymbol });
      return { success: true };
    } else {
      const existing = await Watchlist.findOne({ userId, symbol });
      if (existing) {
        return { success: false, error: "Already in watchlist" };
      }

      await Watchlist.create({
        userId,
        symbol: upperSymbol,
        company,
        added: new Date(),
      });
      return { success: true };
    }
  } catch (error) {
    console.error("Watchlist error:", error);
    return { success: false, error: "Operation failed" };
  }
}

export async function getIsInWatchlist(symbol: string) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) return false;

  const mongoose = await connectToDB();
  const db = mongoose.connection.db;

  const user = await db
    .collection("user")
    .findOne({ email: session.user.email });
  if (!user) return false;

  const item = await Watchlist.findOne({
    userId: user._id.toString(),
    symbol: symbol.toUpperCase(),
  });

  return !!item;
}
