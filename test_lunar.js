const { Solar, Lunar } = require('lunar-javascript');

const solar = Solar.fromYmd(2026, 5, 21);
const lunar = solar.getLunar();

console.log("lunar prototype methods:");
let obj = lunar;
const methods = new Set();
while (obj) {
    Object.getOwnPropertyNames(obj).forEach(prop => {
        if (typeof obj[prop] === 'function') {
            methods.add(prop);
        }
    });
    obj = Object.getPrototypeOf(obj);
}
console.log(Array.from(methods).filter(m => m.toLowerCase().includes('ganzhi') || m.toLowerCase().includes('day') || m.toLowerCase().includes('wuxing') || m.toLowerCase().includes('yi') || m.toLowerCase().includes('ji') || m.toLowerCase().includes('nayin')));
