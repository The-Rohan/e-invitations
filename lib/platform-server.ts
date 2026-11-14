import "server-only";
import fs from "node:fs";
import path from "node:path";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";
import type { Order } from "./platform";
type User = { id: string; email: string; password: string; salt: string };
type DB = {
  leads?: import("./leads").Lead[];
  users: User[];
  orders: Order[];
  sessions: { token: string; userId: string; expires: number }[];
  rsvps: {
    orderId: string;
    name: string;
    count: number;
    attending: boolean;
    requestId?: string;
    eventId?: string;
    responses?: {
      eventId: string;
      eventName: string;
      attending: boolean;
      count: number;
    }[];
  }[];
};
const root =
  process.env.WEDINVITE_DATA_DIR || path.join(process.cwd(), ".data");
export function readDB(): DB {
  fs.mkdirSync(root, { recursive: true, mode: 0o700 });
  const f = path.join(root, "platform.json");
  return fs.existsSync(f)
    ? JSON.parse(fs.readFileSync(f, "utf8"))
    : { users: [], orders: [], sessions: [], rsvps: [] };
}
export function writeDB(db: DB) {
  fs.mkdirSync(root, { recursive: true, mode: 0o700 });
  const f = path.join(root, "platform.json");
  fs.writeFileSync(f + ".tmp", JSON.stringify(db), { mode: 0o600 });
  fs.renameSync(f + ".tmp", f);
}
export const token = () => randomBytes(24).toString("hex");
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export const password = (s: string, salt: string) =>
  scryptSync(s, salt, 64).toString("hex");
export function equal(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export async function identity() {
  const c = await cookies();
  return identityFromCookies(c);
}
export function identityFromCookies(c: Awaited<ReturnType<typeof cookies>>) {
  const db = readDB();
  const session = db.sessions.find(
    (s) =>
      s.token === hash(c.get("wi-session")?.value || "") &&
      s.expires > Date.now(),
  );
  return {
    db,
    user: db.users.find((u) => u.id === session?.userId),
    admin:
      !!process.env.WEDINVITE_ADMIN_KEY &&
      db.sessions.some(
        (s) =>
          s.userId === "admin" &&
          s.token === hash(c.get("wi-admin")?.value || "") &&
          s.expires > Date.now(),
      ),
  };
}
