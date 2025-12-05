import { DBData } from "../models";
import mockData from "./mock-data.json";

class DatabaseWrapper {
  private lowDb?: any;
  private memoryData?: DBData;
  private isServerless: boolean;

  constructor() {
    this.isServerless = process.env.IS_SERVERLESS === "true";

    if (this.isServerless) {
      this.memoryData = mockData as DBData;
    } else {
      this.initLowDb();
    }
  }

  private async initLowDb() {
    const { Low } = await import("lowdb");
    const { JSONFile } = await import("lowdb/node");
    const adapter = new JSONFile<DBData>("./src/db/db.json");
    this.lowDb = new Low<DBData>(adapter, mockData as DBData);
  }

  get data(): DBData | null {
    if (this.isServerless) {
      return this.memoryData || null;
    }
    return this.lowDb?.data || null;
  }

  async read(): Promise<void> {
    if (!this.isServerless && this.lowDb) {
      await this.lowDb.read();
    }
  }

  async write(): Promise<void> {
    if (!this.isServerless && this.lowDb) {
      await this.lowDb.write();
    }
  }
}

export const db = new DatabaseWrapper();
