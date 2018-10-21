/*! fish-barrel
    (c) Erik Blankinship
    MIT License: http://getify.mit-license.org
*/

"use strict";

module.exports = class fishBarrel{

  constructor( poolDepth ) {
    //key: uId, val: [objects]
    this.poolKeysMap = new Map( );
    //key: obj, val: key
    this.poolKeysMapReverse = new Map();
    //queue of objects with keys
    this.poolKeyedObjectsQueue = [];

    this.poolDepth = Number.isInteger( poolDepth ) && poolDepth > 0 ? poolDepth : 10;
  }

  use( key ) {
    //preferably get one of your keyed objects
    if (this.poolKeysMap.has( key )) {
      const objList = this.poolKeysMap.get( key );

      //remove first object, which is the most recently returned object
      const obj = objList.shift( );

      //no more objects with this key?  
      //delete the entry in the Map
      if (objList.length == 0) {
        this.poolKeysMap.delete( key );
      }

      //remove from poolKeysMapReverse
      this.poolKeysMapReverse.delete( obj );

      //now, we need to remove this object from the poolKeyedObjectsQueue
      const idx = this.poolKeyedObjectsQueue.indexOf( obj );
      this.poolKeyedObjectsQueue.splice( idx, 1 );

      //here you go
      return obj;
    }

    //now, if we did not find our keyed object in the pool,
    //then check if we are over size
    if (this.poolKeyedObjectsQueue.length > this.poolDepth) {
      const obj = this.poolKeyedObjectsQueue.pop( );

      const key = this.poolKeysMapReverse.get( obj );
      this.poolKeysMapReverse.delete( obj );

      const objList = this.poolKeysMap.get( key );
      objList.pop();
      if (objList.length == 0) {
        this.poolKeysMap.delete( key );
      }
                
      return obj;
    }


    //still here?  well, we don't have _anything_ for you
    //this function will therefore return `undefined`

    //you should make your own object and recycle it when done via recycle
  }

  recycle( obj, key ) {
    //all objects for recycling should have a key

    //https://stackoverflow.com/a/36419452/62255
    if (Boolean(key)) {
      //front of the queue 
      this.poolKeyedObjectsQueue.unshift( obj );
  
      if (this.poolKeysMap.has( key )) {
        const objList = this.poolKeysMap.get( key );
        objList.unshift( obj );
      }
      else {
        this.poolKeysMap.set( key, [obj] );
      }

      this.poolKeysMapReverse.set( obj, key );
    }
    else {
      throw new Error();
    }
  }

  size( ) {
    return this.poolKeyedObjectsQueue.length;
  }

  clear( ) {
    this.poolKeysMap.clear( );
    this.poolKeysMapReverse.clear( );
    this.poolKeyedObjectsQueue.length = 0;
  }

};