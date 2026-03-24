/**
 * Deep merges two or more objects together.
 * Arrays are concatenated, objects are recursively merged.
 */
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object') {
      if (Array.isArray(source[key])) {
        target[key] = (target[key] || []).concat(source[key]);
      } else {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      }
    } else {
      target[key] = source[key];
    }
  }

  return deepMerge(target, ...sources);
}

function shallowMerge(target, ...sources) {
  return Object.assign({}, target, ...sources);
}

module.exports = { deepMerge, shallowMerge };
