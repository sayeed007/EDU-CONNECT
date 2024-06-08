
const replaceMongoId = (obj) => {
  // If obj is an array, recursively apply replaceMongoId to each element
  if (Array.isArray(obj)) {
    return obj.map(replaceMongoId);
  } else if (obj !== null && typeof obj === 'object') {
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


// REPLACE ALL _id(ObjectId) with id(string) 
export const replaceMongoIdInArray = (array) => {
  return array.map(replaceMongoId);
};



export const replaceMongoIdInObject = (obj) => {
  if (!obj) return null;

  const { _id, ...updatedObj } = { ...obj, id: obj._id.toString() };
  return updatedObj;
};

export const getSlug = (title) => {
  if (!title) return null;

  const slug = title.toLowerCase().replace(/ /g, -'')
    .replace(/[^\w-]+/g, '');

  return slug;
};