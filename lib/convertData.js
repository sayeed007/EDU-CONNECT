const replaceMongoId = (obj) => {
  // If obj is an array, recursively apply replaceMongoId to each element
  if (Array.isArray(obj)) {
    return obj.map(replaceMongoId);
  } else if (obj !== null && typeof obj === 'object') {
    // If obj is a Date, return it as is
    if (obj instanceof Date) {
      return obj;
    }

    // If obj is an object, iterate through its keys
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      if (key === '_id' && value !== null && typeof value === 'object' && typeof value.toString === 'function') {
        // Replace _id with id as string
        acc.id = value.toString();
      } else if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
        // Recursively apply replaceMongoId to nested arrays or objects
        acc[key] = replaceMongoId(value);
      } else {
        // Directly assign other values
        acc[key] = value;
      }
      return acc;
    }, {});
  }
  return obj;
};


// REPLACE ALL _id(ObjectId) with id(string) for an Array 
export const replaceMongoIdInArray = (array) => {
  return array.map(replaceMongoId);
};

// REPLACE ALL _id(ObjectId) with id(string) for an object
export const replaceMongoIdInObject = (obj) => {
  if (!obj) return null;

  return replaceMongoId(obj);
};

export const getSlug = (title) => {
  if (!title) return null;

  const slug = title.toLowerCase().replace(/ /g, -'')
    .replace(/[^\w-]+/g, '');

  return slug;
};