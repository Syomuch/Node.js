type AddFn = (a?: number) => number | AddFn;

function add(sum: number): AddFn {
  const addFn: AddFn = (a?: number) => {
    if (a === undefined) {
      return sum;
    }
    return add(sum + a);
  };

  return addFn;
}

//@ts-ignore
console.log(add(2)(5)(7)(1)(6)(5)(11)()); // 37

function isAnagram(str1: string, str2: string): boolean {
  const arr1 = str1.replace(/\s+/g, "").split("");
  const arr2 = str2.replace(/\s+/g, "").split("");

  if (arr1.length !== arr2.length) {
    return false;
  }

  arr1.sort();
  arr2.sort();

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

console.log(isAnagram("hello", "olleh")); // true
console.log(isAnagram("hello", "olles")); // false

function deepCopy<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = [];
    for (const element of obj) {
      newArray.push(deepCopy(element));
    }
    return newArray as unknown as T;
  }

  const newObj = {} as T;
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepCopy(obj[key]);
    }
  }
  return newObj;
}

const obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
  e: [1, 2, 3],
};

console.log(obj);
console.log(deepCopy(obj));
console.log(obj === deepCopy(obj));

type Func = (...args: number[]) => number;

const cacheResult = (func: Func) => {
  const cache: { [key: string]: number } = {};

  return (...args: number[]) => {
    const key = args.toString();
    if (key in cache) {
      return cache[key];
    } else {
      const result = func(...args);
      cache[key] = result;
      return result;
    }
  };
};

const calc = (a: number, b: number, c: number) => a + b + c;
const wrappedCalc = cacheResult(calc);

console.log(wrappedCalc(1, 2, 3)); // Output: 6 (calculated)
console.log(wrappedCalc(1, 2, 3)); // Output: 6 (cached)
console.log(wrappedCalc(4, 5, 6)); // Output: 15 (calculated)
