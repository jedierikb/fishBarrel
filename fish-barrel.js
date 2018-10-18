/*jshint esversion: 6 */
"use strict";

module.exports = function fishBarrel( string ) {
  if (typeof string !== "string") throw new TypeError("fish barrel wants a string!");
  return string.replace(/\s/g, "");
};