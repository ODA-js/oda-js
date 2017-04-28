export default function fillDefaults(...args: Object[]) {
  if (args.length > 0) {
    // дописать merge с массивами
    let result;
    args.some(a => {
      // if first arg is null then we do not neet to fill it with default values
      if (a !== undefined) {
        if (a === null) {
          result = null;
        } else if (Array.isArray(a)) {
          result = [];
        } else {
          result = {};
        }
        return true;
      } else {
        return false;
      }
    });
    if (result) {
      let array = Array.isArray(result);
      for (let i = 0, len = args.length; i < len; i++) {
        let current = args[i];
        if (current !== undefined) {
          if (!array) {
            let keys = Object.keys(current);
            for (let j = 0, kLen = keys.length; j < kLen; j++) {
              let key = keys[j];
              if (current.hasOwnProperty(key)) {
                let cv = current[key];
                if (!result.hasOwnProperty(key)) {
                  result[key] = cv;
                } else if (result.hasOwnProperty(key) && cv !== null &&
                  (typeof cv === 'object' && (cv.constructor === Object || Array.isArray(cv)))) {
                  result[key] = fillDefaults(result[key], cv);
                }
              }
            }
          } else {
            if (Array.isArray(current)) {
              result.push(...current.slice(result.length));
            }
          }
        }
      }
      return result;
    } else {
      return args[0];
    }
  }
};
