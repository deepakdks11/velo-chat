import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPrivateChatId(uid1: string, uid2: string) {
  return `pm_${[uid1, uid2].sort().join('_')}`;
}
