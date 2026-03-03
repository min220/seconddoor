import { createClient } from "@base44/sdk";

const USE_BASE44 = import.meta.env.VITE_USE_BASE44 === "true";
const APP_ID = import.meta.env.VITE_BASE44_APP_ID;

export const base44 =
  USE_BASE44 && APP_ID ? createClient({ appId: APP_ID }) : null;