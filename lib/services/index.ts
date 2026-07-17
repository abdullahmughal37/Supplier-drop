import { isFirebaseConfigured } from "../firebase";
import type { DataService } from "./data-service";
import { DemoDataService } from "./demo-service";
import { FirebaseDataService } from "./firebase-service";

let instance: DataService | null = null;

/** App-wide data service: Firebase when configured, local demo otherwise. */
export function getDataService(): DataService {
  if (!instance) {
    instance = isFirebaseConfigured ? new FirebaseDataService() : new DemoDataService();
  }
  return instance;
}

export type { DataService } from "./data-service";
