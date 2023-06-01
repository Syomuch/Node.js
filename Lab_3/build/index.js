import fs from "fs";
import path from "path";
import axios from "axios";
import os from "os";
import si from "systeminformation";
// Завдання 1
async function runSequent(array, callback) {
    const results = [];
    for (let i = 0; i < array.length; i++) {
        const result = await callback(array[i], i);
        results.push(result);
    }
    return results;
}
const array = ["first", "second", "third", "fourth", "fifth"];
const results = await runSequent(array, (item, index) => Promise.resolve({
    item,
    index,
}));
console.log(results);
// Завдання 2
function arrayChangeDelete(array, shouldDelete) {
    const deleted = [];
    for (let i = array.length - 1; i >= 0; i--) {
        if (shouldDelete(array[i])) {
            deleted.push(array[i]);
            array.splice(i, 1);
        }
    }
    return deleted.reverse();
}
const Array = [1, 2, 3, 6, 7, 9];
const deletedElements = arrayChangeDelete(Array, (item) => item % 2 === 0);
console.log(Array);
console.log(deletedElements);
// Завдання 3
// Отримуємо шлях до JSON-файлу з аргументів командного рядка
const jsonFile = process.argv[2];
// Отримуємо вміст JSON-файлу та розпарсюємо його у масив посилань
const fileContents = fs.readFileSync(jsonFile, 'utf-8');
const urls = JSON.parse(fileContents);
// Створюємо папку для зберігання HTML-файлів
const folderName = `${path.parse(jsonFile).name}_pages`;
if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
}
// Функція для отримання HTML-вмісту посилання та збереження у файл
async function saveHTML(url) {
    try {
        const response = await axios.get(url);
        const filename = path.basename(url);
        const filepath = path.join(folderName, `${filename}.html`);
        fs.writeFileSync(filepath, response.data);
        console.log(`Saved ${url} to ${filepath}`);
    }
    catch (error) {
        console.error(`Error saving ${url}: ${error.message}`);
    }
}
// Зберігаємо HTML-вміст для кожного посилання
urls.forEach((url) => {
    saveHTML(url);
});
// Завдання 4
const frequency = process.argv[3] || 1; // частота в секундах (за замовчуванням - 1 секунда)
setInterval(async () => {
    console.log(`Operating System: ${os.type()} ${os.release()}`);
    console.log(`Architecture: ${os.arch()}`);
    console.log(`Current User Name: ${os.userInfo().username}`);
    console.log("CPU Cores Models:");
    const cpuInfo = os.cpus();
    cpuInfo.forEach((core) => {
        console.log(`- ${core.model}`);
    });
    const tempInfo = await si.cpuTemperature();
    console.log(`CPU Temperature: ${tempInfo.main}°C`);
    console.log("Graphic Controllers:");
    const graphicsInfo = await si.graphics();
    graphicsInfo.controllers.forEach((controller) => {
        console.log(`- Vendor: ${controller.vendor}, Model: ${controller.model}`);
    });
    const memInfo = await si.mem();
    const totalMemory = (memInfo.total / 1024 / 1024 / 1024).toFixed(2);
    const usedMemory = ((memInfo.total - memInfo.available) /
        1024 /
        1024 /
        1024).toFixed(2);
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
class MyEventEmitter {
    handlers = {};
    registerHandler(eventName, handler) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(handler);
    }
    emitEvent(eventName) {
        if (this.handlers[eventName]) {
            this.handlers[eventName].forEach((handler) => handler());
        }
    }
}
const eventEmitter = new MyEventEmitter();
eventEmitter.registerHandler("userUpdated", () => console.log("Користувач оновився"));
eventEmitter.emitEvent("userUpdated");
