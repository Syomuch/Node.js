function add(x) {
    let sum = x;
  
    function innerAdd(y) {
      if (y !== undefined) {
        sum += y;
        return innerAdd;
      } else {
        return sum;
      }
    }
  
    return innerAdd;
  }
  
  function isAnagram(str1, str2) {
    const arr1 = str1.split("").sort();
    const arr2 = str2.split("").sort();
  
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
  
    return true;
  }
  
  function deepClone(obj) {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
  
    const clone = Array.isArray(obj) ? [] : {};
  
    Object.keys(obj).forEach((key) => {
      clone[key] = deepClone(obj[key]);
    });
  
    return clone;
  }
  
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: 3,
    },
    e: [1, 2, 3],
    f: null
  };
  
  const wrapper = (func) => {
    const cache = {};
  
    return (...args) => {
      const key = args.join(",");
  
      if (cache[key] === undefined) {
        cache[key] = func(...args);
        console.log(`${cache[key]} calculated`);
      } else {
        console.log(`${cache[key]} from cache`);
      }
  
      return cache[key];
    };
  };
  
  console.log(add(2)(5)(7)(1)(6)(5)(11)(1)()); //38
  
  console.log(isAnagram("hello", "lelho"));
  console.log(isAnagram("readme", "murder"));
  
  console.log(obj);
  console.log(deepClone(obj));
  console.log(deepClone(obj) === obj);
  
  const calc = (a, b, c) => a + b + c;
  
  const cachedCalc = wrapper(calc);
  
  console.log(cachedCalc(1, 4, 3)); // 8 calculated
  console.log(cachedCalc(5, 8, 3)); // 16 calculated
  console.log(cachedCalc(1, 4, 3)); // 8 from cache
  