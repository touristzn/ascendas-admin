/**
 * @module data/validate/messages
 * default validate message for async-validator
 */

import {format} from '../../lib/utils';

/**
 * @namespace
 */
const messages =  {
  default: 'Validation error on field %s',
  required: '%s is required',
  enum: '%s must be one of %s',
  whitespace: '%s cannot be empty',
  date: {
    format: '%s date %s is invalid for format %s',
    parse: '%s date could not be parsed, %s is invalid ',
    invalid: '%s date %s is invalid',
  },
  types: {
    string: '%s is not a %s',
    method: '%s is not a %s (function)',
    array: '%s is not an %s',
    object: '%s is not an %s',
    number: '%s is not a %s',
    date: '%s is not a %s',
    boolean: '%s is not a %s',
    integer: '%s is not an %s',
    float: '%s is not a %s',
    regexp: '%s is not a valid %s',
    email: '%s is not a valid %s',
    url: '%s is not a valid %s',
    hex: '%s is not a valid %s',
  },
  string: {
    len: '%s must be exactly %s characters',
    min: '%s must be at least %s characters',
    max: '%s cannot be longer than %s characters',
    range: '%s must be between %s and %s characters',
  },
  number: {
    len: '%s must equal %s',
    min: '%s cannot be less than %s',
    max: '%s cannot be greater than %s',
    range: '%s must be between %s and %s',
  },
  array: {
    len: '%s must be exactly %s in length',
    min: '%s cannot be less than %s in length',
    max: '%s cannot be greater than %s in length',
    range: '%s must be between %s and %s in length',
  },
  pattern: {
    mismatch: '%s value %s does not match pattern %s',
  }
};

function convertMessage(result, key, msg, fields) {

  if (typeof msg === 'string') {

    result[key] = function(field, ...args) {

      let arr = field.split('.', 2);
      let f = field;

      if (arr.length == 2 && fields[arr[0]] && fields[arr[0]][arr[1]]) {
        f = fields[arr[0]][arr[1]];
      } else if (fields[field]) {
        f = fields[field];
      }

      return format(f, ...args);
    }

  } else if (typeof msg === 'object') {

    result[key] = {};
    Object.keys(msg).forEach(k => {
      convertMessage(result[key], k, msg[k], fields);
    });

  }
}

/**
 * [getMessages description]
 * @param  {Object} options
 * @param  {Object} options.fields
 * @return {Object}
 */
export function getMessages(options={}) {
  let fields = options.fields || {};
  let result = {};

  Object.keys(messages).forEach(key => {
    convertMessage(result, key, messages[key], fields);
  });

  return result;
}
