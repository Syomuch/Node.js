import fs from "fs";
import path from "path";
import axios from "axios";
import os from "os";
import si from "systeminformation";

// Завдання 1
async function runSequent<T, R>(
  array: T[],
  callback: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < array.length; i++) {
    const result = await callback(array[i], i);
    results.push(result);
  }

  return results;
}

const array: string[] = ["one", "two", "thee", "four", "five", "six"];
const promiseArray = array.map((item, index) =>
  Promise.resolve({
    item,
    index,
  })
);

const resultsPromise = Promise.all(promiseArray);

resultsPromise.then(results => {
    console.log(results);
}).catch(error => {
  console.error(error);
});

// Завдання 2
function arrayChangeDelete<T>(
  array: T[],
  shouldDelete: (item: T) => boolean
): T[] {
  const deleted: T[] = [];

  for (let i = array.length - 1; i >= 0; i--) {
    if (shouldDelete(array[i])) {
      deleted.push(array[i]);
      array.splice(i, 1);
    }
  }

  return deleted.reverse();
}

const arr = [1, 2, 3, 6, 7, 9];
const deletedElements = arrayChangeDelete(arr, (item) => item % 2 === 0);

console.log(arr);
console.log(deletedElements);

// Завдання 3
const jsonFile = process.argv[2];

const fileContents = fs.readFileSync(jsonFile, 'utf-8');
const urls = JSON.parse(fileContents);

const folderName = `${path.parse(jsonFile).name}_pages`;
if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

async function saveHTML(url: any) {
  try {
    const response = await axios.get(url);
    const filename = path.basename(url);
    const filepath = path.join(folderName, `${filename}.html`);
    fs.writeFileSync(filepath, response.data);
    console.log(`Saved ${url} to ${filepath}`);
  } catch (error: any) {
    console.error(`Error saving ${url}: ${error.message}`);
  }
}

urls.forEach((url: any) => {
  saveHTML(url);
});

// Завдання 4
const frequency: any = process.argv[3] || 1; // частота в секундах (за замовчуванням - 1 секунда)

setInterval(async () => {
  console.log(`Operating System: ${os.type()} ${os.release()}`);
  console.log(`Architecture: ${os.arch()}`);
  console.log(`Current User Name: ${os.userInfo().username}`);
  console.log("CPU Cores Models:");
  const cpuInfo = os.cpus();
  cpuInfo.forEach((core: any) => {
    console.log(`- ${core.model}`);
  });
  const tempInfo = await si.cpuTemperature();
  console.log(`CPU Temperature: ${tempInfo.main}°C`);
  console.log("Graphic Controllers:");
  const graphicsInfo = await si.graphics();
  graphicsInfo.controllers.forEach((controller: any) => {
    console.log(`- Vendor: ${controller.vendor}, Model: ${controller.model}`);
  });
  const memInfo = await si.mem();
  const totalMemory = (memInfo.total / 1024 / 1024 / 1024).toFixed(2);
  const usedMemory = (
    (memInfo.total - memInfo.available) /
    1024 /
    1024 /
    1024
  ).toFixed(2);
  const freeMemory = (memInfo.available / 1024 / 1024 / 1024).toFixed(2);
  console.log(`Total Memory: ${totalMemory} GB`);
  console.log(`Used Memory: ${usedMemory} GB`);
  console.log(`Free Memory: ${freeMemory} GB`);
  console.log("Battery Information:");
  const batteryInfo = await si.battery();
  console.log(`- Charging: ${batteryInfo.isCharging ? "Yes" : "No"}`);
  console.log(`- Percentage: ${batteryInfo.percent}%`);
  console.log("----------------------------------------");
}, frequency * 1000);

// Завдання 5
type EventHandler = () => void;

class MyEventEmitter {
  private handlers: { [eventName: string]: EventHandler[] } = {};

  public registerHandler(eventName: string, handler: EventHandler) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  public emitEvent(eventName: string) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((handler) => handler());
    }
  }
}

const eventEmitter = new MyEventEmitter();
eventEmitter.registerHandler("userUpdated", () =>
  console.log("Користувач оновився")
);
eventEmitter.emitEvent("userUpdated");
