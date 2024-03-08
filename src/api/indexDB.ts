import { Job } from "../types";

const DB_NAME = "rematter_db";
const DB_VERSION = 1;
let DB: IDBDatabase;

export default {
  async getDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      console.log("[IDB]: OPENING DB", DB);
      let request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.log("[IDB]: Error eopening db", e);
        reject("Error");
      };

      request.onsuccess = (e) => {
        DB = (<IDBRequest>e.target)!.result;
        resolve(DB);
      };

      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        console.log("[IDB]: onupgradeneeded");
        let db = (<IDBRequest>e.target)!.result;

        // use out-of-line key
        db.createObjectStore("jobs", { autoIncrement: false });
      };
    });
  },
  async getJobs() {
    let db = await this.getDB();

    return new Promise<Array<Job>>((resolve) => {
      let jobs: Array<Job> = [];
      let transaction = db.transaction(["jobs"], "readonly");
      transaction.oncomplete = () => {
        resolve(jobs);
      };

      let store = transaction.objectStore("jobs");
      store.openCursor().onsuccess = (e) => {
        let cursor = (<IDBRequest>e.target)!.result;
        if (cursor) {
          jobs.push(cursor.value);
          cursor.continue();
        }
      };
    });
  },
  async putJob(job: Job, key: number) {
    let db = await this.getDB();

    return new Promise<void>((resolve) => {
      let transaction = db.transaction(["jobs"], "readwrite");

      let putObjRequest = transaction.objectStore("jobs").put(job, key);
      putObjRequest.onsuccess = () => {
        resolve();
      };
    });
  },
  async deleteJob(key: number | null) {
    let db = await this.getDB();

    return new Promise<void>((resolve) => {
      let trans = db.transaction(["jobs"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("jobs");
      store.delete(key!).onsuccess = () => {
        resolve();
      };
    });
  },
};
