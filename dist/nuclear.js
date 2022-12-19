var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/immutable/dist/immutable.js
var require_immutable = __commonJS({
  "node_modules/immutable/dist/immutable.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.Immutable = factory();
    })(exports, function() {
      "use strict";
      var SLICE$0 = Array.prototype.slice;
      function createClass(ctor, superClass) {
        if (superClass) {
          ctor.prototype = Object.create(superClass.prototype);
        }
        ctor.prototype.constructor = ctor;
      }
      function Iterable(value) {
        return isIterable(value) ? value : Seq(value);
      }
      createClass(KeyedIterable, Iterable);
      function KeyedIterable(value) {
        return isKeyed(value) ? value : KeyedSeq(value);
      }
      createClass(IndexedIterable, Iterable);
      function IndexedIterable(value) {
        return isIndexed(value) ? value : IndexedSeq(value);
      }
      createClass(SetIterable, Iterable);
      function SetIterable(value) {
        return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
      }
      function isIterable(maybeIterable) {
        return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
      }
      function isKeyed(maybeKeyed) {
        return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
      }
      function isIndexed(maybeIndexed) {
        return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
      }
      function isAssociative(maybeAssociative) {
        return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
      }
      function isOrdered(maybeOrdered) {
        return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
      }
      Iterable.isIterable = isIterable;
      Iterable.isKeyed = isKeyed;
      Iterable.isIndexed = isIndexed;
      Iterable.isAssociative = isAssociative;
      Iterable.isOrdered = isOrdered;
      Iterable.Keyed = KeyedIterable;
      Iterable.Indexed = IndexedIterable;
      Iterable.Set = SetIterable;
      var IS_ITERABLE_SENTINEL = "@@__IMMUTABLE_ITERABLE__@@";
      var IS_KEYED_SENTINEL = "@@__IMMUTABLE_KEYED__@@";
      var IS_INDEXED_SENTINEL = "@@__IMMUTABLE_INDEXED__@@";
      var IS_ORDERED_SENTINEL = "@@__IMMUTABLE_ORDERED__@@";
      var DELETE = "delete";
      var SHIFT = 5;
      var SIZE = 1 << SHIFT;
      var MASK = SIZE - 1;
      var NOT_SET = {};
      var CHANGE_LENGTH = { value: false };
      var DID_ALTER = { value: false };
      function MakeRef(ref) {
        ref.value = false;
        return ref;
      }
      function SetRef(ref) {
        ref && (ref.value = true);
      }
      function OwnerID() {
      }
      function arrCopy(arr, offset) {
        offset = offset || 0;
        var len = Math.max(0, arr.length - offset);
        var newArr = new Array(len);
        for (var ii = 0; ii < len; ii++) {
          newArr[ii] = arr[ii + offset];
        }
        return newArr;
      }
      function ensureSize(iter) {
        if (iter.size === void 0) {
          iter.size = iter.__iterate(returnTrue);
        }
        return iter.size;
      }
      function wrapIndex(iter, index) {
        if (typeof index !== "number") {
          var uint32Index = index >>> 0;
          if ("" + uint32Index !== index || uint32Index === 4294967295) {
            return NaN;
          }
          index = uint32Index;
        }
        return index < 0 ? ensureSize(iter) + index : index;
      }
      function returnTrue() {
        return true;
      }
      function wholeSlice(begin, end, size) {
        return (begin === 0 || size !== void 0 && begin <= -size) && (end === void 0 || size !== void 0 && end >= size);
      }
      function resolveBegin(begin, size) {
        return resolveIndex(begin, size, 0);
      }
      function resolveEnd(end, size) {
        return resolveIndex(end, size, size);
      }
      function resolveIndex(index, size, defaultIndex) {
        return index === void 0 ? defaultIndex : index < 0 ? Math.max(0, size + index) : size === void 0 ? index : Math.min(size, index);
      }
      var ITERATE_KEYS = 0;
      var ITERATE_VALUES = 1;
      var ITERATE_ENTRIES = 2;
      var REAL_ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;
      function Iterator(next) {
        this.next = next;
      }
      Iterator.prototype.toString = function() {
        return "[Iterator]";
      };
      Iterator.KEYS = ITERATE_KEYS;
      Iterator.VALUES = ITERATE_VALUES;
      Iterator.ENTRIES = ITERATE_ENTRIES;
      Iterator.prototype.inspect = Iterator.prototype.toSource = function() {
        return this.toString();
      };
      Iterator.prototype[ITERATOR_SYMBOL] = function() {
        return this;
      };
      function iteratorValue(type, k, v, iteratorResult) {
        var value = type === 0 ? k : type === 1 ? v : [k, v];
        iteratorResult ? iteratorResult.value = value : iteratorResult = {
          value,
          done: false
        };
        return iteratorResult;
      }
      function iteratorDone() {
        return { value: void 0, done: true };
      }
      function hasIterator(maybeIterable) {
        return !!getIteratorFn(maybeIterable);
      }
      function isIterator(maybeIterator) {
        return maybeIterator && typeof maybeIterator.next === "function";
      }
      function getIterator(iterable) {
        var iteratorFn = getIteratorFn(iterable);
        return iteratorFn && iteratorFn.call(iterable);
      }
      function getIteratorFn(iterable) {
        var iteratorFn = iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === "function") {
          return iteratorFn;
        }
      }
      function isArrayLike(value) {
        return value && typeof value.length === "number";
      }
      createClass(Seq, Iterable);
      function Seq(value) {
        return value === null || value === void 0 ? emptySequence() : isIterable(value) ? value.toSeq() : seqFromValue(value);
      }
      Seq.of = function() {
        return Seq(arguments);
      };
      Seq.prototype.toSeq = function() {
        return this;
      };
      Seq.prototype.toString = function() {
        return this.__toString("Seq {", "}");
      };
      Seq.prototype.cacheResult = function() {
        if (!this._cache && this.__iterateUncached) {
          this._cache = this.entrySeq().toArray();
          this.size = this._cache.length;
        }
        return this;
      };
      Seq.prototype.__iterate = function(fn, reverse) {
        return seqIterate(this, fn, reverse, true);
      };
      Seq.prototype.__iterator = function(type, reverse) {
        return seqIterator(this, type, reverse, true);
      };
      createClass(KeyedSeq, Seq);
      function KeyedSeq(value) {
        return value === null || value === void 0 ? emptySequence().toKeyedSeq() : isIterable(value) ? isKeyed(value) ? value.toSeq() : value.fromEntrySeq() : keyedSeqFromValue(value);
      }
      KeyedSeq.prototype.toKeyedSeq = function() {
        return this;
      };
      createClass(IndexedSeq, Seq);
      function IndexedSeq(value) {
        return value === null || value === void 0 ? emptySequence() : !isIterable(value) ? indexedSeqFromValue(value) : isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
      }
      IndexedSeq.of = function() {
        return IndexedSeq(arguments);
      };
      IndexedSeq.prototype.toIndexedSeq = function() {
        return this;
      };
      IndexedSeq.prototype.toString = function() {
        return this.__toString("Seq [", "]");
      };
      IndexedSeq.prototype.__iterate = function(fn, reverse) {
        return seqIterate(this, fn, reverse, false);
      };
      IndexedSeq.prototype.__iterator = function(type, reverse) {
        return seqIterator(this, type, reverse, false);
      };
      createClass(SetSeq, Seq);
      function SetSeq(value) {
        return (value === null || value === void 0 ? emptySequence() : !isIterable(value) ? indexedSeqFromValue(value) : isKeyed(value) ? value.entrySeq() : value).toSetSeq();
      }
      SetSeq.of = function() {
        return SetSeq(arguments);
      };
      SetSeq.prototype.toSetSeq = function() {
        return this;
      };
      Seq.isSeq = isSeq;
      Seq.Keyed = KeyedSeq;
      Seq.Set = SetSeq;
      Seq.Indexed = IndexedSeq;
      var IS_SEQ_SENTINEL = "@@__IMMUTABLE_SEQ__@@";
      Seq.prototype[IS_SEQ_SENTINEL] = true;
      createClass(ArraySeq, IndexedSeq);
      function ArraySeq(array) {
        this._array = array;
        this.size = array.length;
      }
      ArraySeq.prototype.get = function(index, notSetValue) {
        return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
      };
      ArraySeq.prototype.__iterate = function(fn, reverse) {
        var array = this._array;
        var maxIndex = array.length - 1;
        for (var ii = 0; ii <= maxIndex; ii++) {
          if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
            return ii + 1;
          }
        }
        return ii;
      };
      ArraySeq.prototype.__iterator = function(type, reverse) {
        var array = this._array;
        var maxIndex = array.length - 1;
        var ii = 0;
        return new Iterator(
          function() {
            return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++]);
          }
        );
      };
      createClass(ObjectSeq, KeyedSeq);
      function ObjectSeq(object) {
        var keys = Object.keys(object);
        this._object = object;
        this._keys = keys;
        this.size = keys.length;
      }
      ObjectSeq.prototype.get = function(key, notSetValue) {
        if (notSetValue !== void 0 && !this.has(key)) {
          return notSetValue;
        }
        return this._object[key];
      };
      ObjectSeq.prototype.has = function(key) {
        return this._object.hasOwnProperty(key);
      };
      ObjectSeq.prototype.__iterate = function(fn, reverse) {
        var object = this._object;
        var keys = this._keys;
        var maxIndex = keys.length - 1;
        for (var ii = 0; ii <= maxIndex; ii++) {
          var key = keys[reverse ? maxIndex - ii : ii];
          if (fn(object[key], key, this) === false) {
            return ii + 1;
          }
        }
        return ii;
      };
      ObjectSeq.prototype.__iterator = function(type, reverse) {
        var object = this._object;
        var keys = this._keys;
        var maxIndex = keys.length - 1;
        var ii = 0;
        return new Iterator(function() {
          var key = keys[reverse ? maxIndex - ii : ii];
          return ii++ > maxIndex ? iteratorDone() : iteratorValue(type, key, object[key]);
        });
      };
      ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;
      createClass(IterableSeq, IndexedSeq);
      function IterableSeq(iterable) {
        this._iterable = iterable;
        this.size = iterable.length || iterable.size;
      }
      IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
        if (reverse) {
          return this.cacheResult().__iterate(fn, reverse);
        }
        var iterable = this._iterable;
        var iterator = getIterator(iterable);
        var iterations = 0;
        if (isIterator(iterator)) {
          var step;
          while (!(step = iterator.next()).done) {
            if (fn(step.value, iterations++, this) === false) {
              break;
            }
          }
        }
        return iterations;
      };
      IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
        if (reverse) {
          return this.cacheResult().__iterator(type, reverse);
        }
        var iterable = this._iterable;
        var iterator = getIterator(iterable);
        if (!isIterator(iterator)) {
          return new Iterator(iteratorDone);
        }
        var iterations = 0;
        return new Iterator(function() {
          var step = iterator.next();
          return step.done ? step : iteratorValue(type, iterations++, step.value);
        });
      };
      createClass(IteratorSeq, IndexedSeq);
      function IteratorSeq(iterator) {
        this._iterator = iterator;
        this._iteratorCache = [];
      }
      IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
        if (reverse) {
          return this.cacheResult().__iterate(fn, reverse);
        }
        var iterator = this._iterator;
        var cache = this._iteratorCache;
        var iterations = 0;
        while (iterations < cache.length) {
          if (fn(cache[iterations], iterations++, this) === false) {
            return iterations;
          }
        }
        var step;
        while (!(step = iterator.next()).done) {
          var val = step.value;
          cache[iterations] = val;
          if (fn(val, iterations++, this) === false) {
            break;
          }
        }
        return iterations;
      };
      IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
        if (reverse) {
          return this.cacheResult().__iterator(type, reverse);
        }
        var iterator = this._iterator;
        var cache = this._iteratorCache;
        var iterations = 0;
        return new Iterator(function() {
          if (iterations >= cache.length) {
            var step = iterator.next();
            if (step.done) {
              return step;
            }
            cache[iterations] = step.value;
          }
          return iteratorValue(type, iterations, cache[iterations++]);
        });
      };
      function isSeq(maybeSeq) {
        return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
      }
      var EMPTY_SEQ;
      function emptySequence() {
        return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
      }
      function keyedSeqFromValue(value) {
        var seq = Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() : isIterator(value) ? new IteratorSeq(value).fromEntrySeq() : hasIterator(value) ? new IterableSeq(value).fromEntrySeq() : typeof value === "object" ? new ObjectSeq(value) : void 0;
        if (!seq) {
          throw new TypeError(
            "Expected Array or iterable object of [k, v] entries, or keyed object: " + value
          );
        }
        return seq;
      }
      function indexedSeqFromValue(value) {
        var seq = maybeIndexedSeqFromValue(value);
        if (!seq) {
          throw new TypeError(
            "Expected Array or iterable object of values: " + value
          );
        }
        return seq;
      }
      function seqFromValue(value) {
        var seq = maybeIndexedSeqFromValue(value) || typeof value === "object" && new ObjectSeq(value);
        if (!seq) {
          throw new TypeError(
            "Expected Array or iterable object of values, or keyed object: " + value
          );
        }
        return seq;
      }
      function maybeIndexedSeqFromValue(value) {
        return isArrayLike(value) ? new ArraySeq(value) : isIterator(value) ? new IteratorSeq(value) : hasIterator(value) ? new IterableSeq(value) : void 0;
      }
      function seqIterate(seq, fn, reverse, useKeys) {
        var cache = seq._cache;
        if (cache) {
          var maxIndex = cache.length - 1;
          for (var ii = 0; ii <= maxIndex; ii++) {
            var entry = cache[reverse ? maxIndex - ii : ii];
            if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
              return ii + 1;
            }
          }
          return ii;
        }
        return seq.__iterateUncached(fn, reverse);
      }
      function seqIterator(seq, type, reverse, useKeys) {
        var cache = seq._cache;
        if (cache) {
          var maxIndex = cache.length - 1;
          var ii = 0;
          return new Iterator(function() {
            var entry = cache[reverse ? maxIndex - ii : ii];
            return ii++ > maxIndex ? iteratorDone() : iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
          });
        }
        return seq.__iteratorUncached(type, reverse);
      }
      function fromJS(json, converter) {
        return converter ? fromJSWith(converter, json, "", { "": json }) : fromJSDefault(json);
      }
      function fromJSWith(converter, json, key, parentJSON) {
        if (Array.isArray(json)) {
          return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k) {
            return fromJSWith(converter, v, k, json);
          }));
        }
        if (isPlainObj(json)) {
          return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k) {
            return fromJSWith(converter, v, k, json);
          }));
        }
        return json;
      }
      function fromJSDefault(json) {
        if (Array.isArray(json)) {
          return IndexedSeq(json).map(fromJSDefault).toList();
        }
        if (isPlainObj(json)) {
          return KeyedSeq(json).map(fromJSDefault).toMap();
        }
        return json;
      }
      function isPlainObj(value) {
        return value && (value.constructor === Object || value.constructor === void 0);
      }
      function is(valueA, valueB) {
        if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
          return true;
        }
        if (!valueA || !valueB) {
          return false;
        }
        if (typeof valueA.valueOf === "function" && typeof valueB.valueOf === "function") {
          valueA = valueA.valueOf();
          valueB = valueB.valueOf();
          if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
            return true;
          }
          if (!valueA || !valueB) {
            return false;
          }
        }
        if (typeof valueA.equals === "function" && typeof valueB.equals === "function" && valueA.equals(valueB)) {
          return true;
        }
        return false;
      }
      function deepEqual(a, b) {
        if (a === b) {
          return true;
        }
        if (!isIterable(b) || a.size !== void 0 && b.size !== void 0 && a.size !== b.size || a.__hash !== void 0 && b.__hash !== void 0 && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)) {
          return false;
        }
        if (a.size === 0 && b.size === 0) {
          return true;
        }
        var notAssociative = !isAssociative(a);
        if (isOrdered(a)) {
          var entries = a.entries();
          return b.every(function(v, k) {
            var entry = entries.next().value;
            return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
          }) && entries.next().done;
        }
        var flipped = false;
        if (a.size === void 0) {
          if (b.size === void 0) {
            if (typeof a.cacheResult === "function") {
              a.cacheResult();
            }
          } else {
            flipped = true;
            var _ = a;
            a = b;
            b = _;
          }
        }
        var allEqual = true;
        var bSize = b.__iterate(function(v, k) {
          if (notAssociative ? !a.has(v) : flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
            allEqual = false;
            return false;
          }
        });
        return allEqual && a.size === bSize;
      }
      createClass(Repeat, IndexedSeq);
      function Repeat(value, times) {
        if (!(this instanceof Repeat)) {
          return new Repeat(value, times);
        }
        this._value = value;
        this.size = times === void 0 ? Infinity : Math.max(0, times);
        if (this.size === 0) {
          if (EMPTY_REPEAT) {
            return EMPTY_REPEAT;
          }
          EMPTY_REPEAT = this;
        }
      }
      Repeat.prototype.toString = function() {
        if (this.size === 0) {
          return "Repeat []";
        }
        return "Repeat [ " + this._value + " " + this.size + " times ]";
      };
      Repeat.prototype.get = function(index, notSetValue) {
        return this.has(index) ? this._value : notSetValue;
      };
      Repeat.prototype.includes = function(searchValue) {
        return is(this._value, searchValue);
      };
      Repeat.prototype.slice = function(begin, end) {
        var size = this.size;
        return wholeSlice(begin, end, size) ? this : new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
      };
      Repeat.prototype.reverse = function() {
        return this;
      };
      Repeat.prototype.indexOf = function(searchValue) {
        if (is(this._value, searchValue)) {
          return 0;
        }
        return -1;
      };
      Repeat.prototype.lastIndexOf = function(searchValue) {
        if (is(this._value, searchValue)) {
          return this.size;
        }
        return -1;
      };
      Repeat.prototype.__iterate = function(fn, reverse) {
        for (var ii = 0; ii < this.size; ii++) {
          if (fn(this._value, ii, this) === false) {
            return ii + 1;
          }
        }
        return ii;
      };
      Repeat.prototype.__iterator = function(type, reverse) {
        var this$0 = this;
        var ii = 0;
        return new Iterator(
          function() {
            return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone();
          }
        );
      };
      Repeat.prototype.equals = function(other) {
        return other instanceof Repeat ? is(this._value, other._value) : deepEqual(other);
      };
      var EMPTY_REPEAT;
      function invariant(condition, error) {
        if (!condition)
          throw new Error(error);
      }
      createClass(Range, IndexedSeq);
      function Range(start, end, step) {
        if (!(this instanceof Range)) {
          return new Range(start, end, step);
        }
        invariant(step !== 0, "Cannot step a Range by 0");
        start = start || 0;
        if (end === void 0) {
          end = Infinity;
        }
        step = step === void 0 ? 1 : Math.abs(step);
        if (end < start) {
          step = -step;
        }
        this._start = start;
        this._end = end;
        this._step = step;
        this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
        if (this.size === 0) {
          if (EMPTY_RANGE) {
            return EMPTY_RANGE;
          }
          EMPTY_RANGE = this;
        }
      }
      Range.prototype.toString = function() {
        if (this.size === 0) {
          return "Range []";
        }
        return "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
      };
      Range.prototype.get = function(index, notSetValue) {
        return this.has(index) ? this._start + wrapIndex(this, index) * this._step : notSetValue;
      };
      Range.prototype.includes = function(searchValue) {
        var possibleIndex = (searchValue - this._start) / this._step;
        return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);
      };
      Range.prototype.slice = function(begin, end) {
        if (wholeSlice(begin, end, this.size)) {
          return this;
        }
        begin = resolveBegin(begin, this.size);
        end = resolveEnd(end, this.size);
        if (end <= begin) {
          return new Range(0, 0);
        }
        return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
      };
      Range.prototype.indexOf = function(searchValue) {
        var offsetValue = searchValue - this._start;
        if (offsetValue % this._step === 0) {
          var index = offsetValue / this._step;
          if (index >= 0 && index < this.size) {
            return index;
          }
        }
        return -1;
      };
      Range.prototype.lastIndexOf = function(searchValue) {
        return this.indexOf(searchValue);
      };
      Range.prototype.__iterate = function(fn, reverse) {
        var maxIndex = this.size - 1;
        var step = this._step;
        var value = reverse ? this._start + maxIndex * step : this._start;
        for (var ii = 0; ii <= maxIndex; ii++) {
          if (fn(value, ii, this) === false) {
            return ii + 1;
          }
          value += reverse ? -step : step;
        }
        return ii;
      };
      Range.prototype.__iterator = function(type, reverse) {
        var maxIndex = this.size - 1;
        var step = this._step;
        var value = reverse ? this._start + maxIndex * step : this._start;
        var ii = 0;
        return new Iterator(function() {
          var v = value;
          value += reverse ? -step : step;
          return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
        });
      };
      Range.prototype.equals = function(other) {
        return other instanceof Range ? this._start === other._start && this._end === other._end && this._step === other._step : deepEqual(this, other);
      };
      var EMPTY_RANGE;
      createClass(Collection, Iterable);
      function Collection() {
        throw TypeError("Abstract");
      }
      createClass(KeyedCollection, Collection);
      function KeyedCollection() {
      }
      createClass(IndexedCollection, Collection);
      function IndexedCollection() {
      }
      createClass(SetCollection, Collection);
      function SetCollection() {
      }
      Collection.Keyed = KeyedCollection;
      Collection.Indexed = IndexedCollection;
      Collection.Set = SetCollection;
      var imul = typeof Math.imul === "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function imul2(a, b) {
        a = a | 0;
        b = b | 0;
        var c = a & 65535;
        var d = b & 65535;
        return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0;
      };
      function smi(i32) {
        return i32 >>> 1 & 1073741824 | i32 & 3221225471;
      }
      function hash(o) {
        if (o === false || o === null || o === void 0) {
          return 0;
        }
        if (typeof o.valueOf === "function") {
          o = o.valueOf();
          if (o === false || o === null || o === void 0) {
            return 0;
          }
        }
        if (o === true) {
          return 1;
        }
        var type = typeof o;
        if (type === "number") {
          if (o !== o || o === Infinity) {
            return 0;
          }
          var h = o | 0;
          if (h !== o) {
            h ^= o * 4294967295;
          }
          while (o > 4294967295) {
            o /= 4294967295;
            h ^= o;
          }
          return smi(h);
        }
        if (type === "string") {
          return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
        }
        if (typeof o.hashCode === "function") {
          return o.hashCode();
        }
        if (type === "object") {
          return hashJSObj(o);
        }
        if (typeof o.toString === "function") {
          return hashString(o.toString());
        }
        throw new Error("Value type " + type + " cannot be hashed.");
      }
      function cachedHashString(string) {
        var hash2 = stringHashCache[string];
        if (hash2 === void 0) {
          hash2 = hashString(string);
          if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
            STRING_HASH_CACHE_SIZE = 0;
            stringHashCache = {};
          }
          STRING_HASH_CACHE_SIZE++;
          stringHashCache[string] = hash2;
        }
        return hash2;
      }
      function hashString(string) {
        var hash2 = 0;
        for (var ii = 0; ii < string.length; ii++) {
          hash2 = 31 * hash2 + string.charCodeAt(ii) | 0;
        }
        return smi(hash2);
      }
      function hashJSObj(obj) {
        var hash2;
        if (usingWeakMap) {
          hash2 = weakMap.get(obj);
          if (hash2 !== void 0) {
            return hash2;
          }
        }
        hash2 = obj[UID_HASH_KEY];
        if (hash2 !== void 0) {
          return hash2;
        }
        if (!canDefineProperty) {
          hash2 = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
          if (hash2 !== void 0) {
            return hash2;
          }
          hash2 = getIENodeHash(obj);
          if (hash2 !== void 0) {
            return hash2;
          }
        }
        hash2 = ++objHashUID;
        if (objHashUID & 1073741824) {
          objHashUID = 0;
        }
        if (usingWeakMap) {
          weakMap.set(obj, hash2);
        } else if (isExtensible !== void 0 && isExtensible(obj) === false) {
          throw new Error("Non-extensible objects are not allowed as keys.");
        } else if (canDefineProperty) {
          Object.defineProperty(obj, UID_HASH_KEY, {
            "enumerable": false,
            "configurable": false,
            "writable": false,
            "value": hash2
          });
        } else if (obj.propertyIsEnumerable !== void 0 && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
          obj.propertyIsEnumerable = function() {
            return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
          };
          obj.propertyIsEnumerable[UID_HASH_KEY] = hash2;
        } else if (obj.nodeType !== void 0) {
          obj[UID_HASH_KEY] = hash2;
        } else {
          throw new Error("Unable to set a non-enumerable property on object.");
        }
        return hash2;
      }
      var isExtensible = Object.isExtensible;
      var canDefineProperty = function() {
        try {
          Object.defineProperty({}, "@", {});
          return true;
        } catch (e) {
          return false;
        }
      }();
      function getIENodeHash(node) {
        if (node && node.nodeType > 0) {
          switch (node.nodeType) {
            case 1:
              return node.uniqueID;
            case 9:
              return node.documentElement && node.documentElement.uniqueID;
          }
        }
      }
      var usingWeakMap = typeof WeakMap === "function";
      var weakMap;
      if (usingWeakMap) {
        weakMap = /* @__PURE__ */ new WeakMap();
      }
      var objHashUID = 0;
      var UID_HASH_KEY = "__immutablehash__";
      if (typeof Symbol === "function") {
        UID_HASH_KEY = Symbol(UID_HASH_KEY);
      }
      var STRING_HASH_CACHE_MIN_STRLEN = 16;
      var STRING_HASH_CACHE_MAX_SIZE = 255;
      var STRING_HASH_CACHE_SIZE = 0;
      var stringHashCache = {};
      function assertNotInfinite(size) {
        invariant(
          size !== Infinity,
          "Cannot perform this action with an infinite size."
        );
      }
      createClass(Map4, KeyedCollection);
      function Map4(value) {
        return value === null || value === void 0 ? emptyMap() : isMap(value) && !isOrdered(value) ? value : emptyMap().withMutations(function(map) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k) {
            return map.set(k, v);
          });
        });
      }
      Map4.of = function() {
        var keyValues = SLICE$0.call(arguments, 0);
        return emptyMap().withMutations(function(map) {
          for (var i = 0; i < keyValues.length; i += 2) {
            if (i + 1 >= keyValues.length) {
              throw new Error("Missing value for key: " + keyValues[i]);
            }
            map.set(keyValues[i], keyValues[i + 1]);
          }
        });
      };
      Map4.prototype.toString = function() {
        return this.__toString("Map {", "}");
      };
      Map4.prototype.get = function(k, notSetValue) {
        return this._root ? this._root.get(0, void 0, k, notSetValue) : notSetValue;
      };
      Map4.prototype.set = function(k, v) {
        return updateMap(this, k, v);
      };
      Map4.prototype.setIn = function(keyPath, v) {
        return this.updateIn(keyPath, NOT_SET, function() {
          return v;
        });
      };
      Map4.prototype.remove = function(k) {
        return updateMap(this, k, NOT_SET);
      };
      Map4.prototype.deleteIn = function(keyPath) {
        return this.updateIn(keyPath, function() {
          return NOT_SET;
        });
      };
      Map4.prototype.update = function(k, notSetValue, updater) {
        return arguments.length === 1 ? k(this) : this.updateIn([k], notSetValue, updater);
      };
      Map4.prototype.updateIn = function(keyPath, notSetValue, updater) {
        if (!updater) {
          updater = notSetValue;
          notSetValue = void 0;
        }
        var updatedValue = updateInDeepMap(
          this,
          forceIterator(keyPath),
          notSetValue,
          updater
        );
        return updatedValue === NOT_SET ? void 0 : updatedValue;
      };
      Map4.prototype.clear = function() {
        if (this.size === 0) {
          return this;
        }
        if (this.__ownerID) {
          this.size = 0;
          this._root = null;
          this.__hash = void 0;
          this.__altered = true;
          return this;
        }
        return emptyMap();
      };
      Map4.prototype.merge = function() {
        return mergeIntoMapWith(this, void 0, arguments);
      };
      Map4.prototype.mergeWith = function(merger) {
        var iters = SLICE$0.call(arguments, 1);
        return mergeIntoMapWith(this, merger, iters);
      };
      Map4.prototype.mergeIn = function(keyPath) {
        var iters = SLICE$0.call(arguments, 1);
        return this.updateIn(
          keyPath,
          emptyMap(),
          function(m) {
            return typeof m.merge === "function" ? m.merge.apply(m, iters) : iters[iters.length - 1];
          }
        );
      };
      Map4.prototype.mergeDeep = function() {
        return mergeIntoMapWith(this, deepMerger, arguments);
      };
      Map4.prototype.mergeDeepWith = function(merger) {
        var iters = SLICE$0.call(arguments, 1);
        return mergeIntoMapWith(this, deepMergerWith(merger), iters);
      };
      Map4.prototype.mergeDeepIn = function(keyPath) {
        var iters = SLICE$0.call(arguments, 1);
        return this.updateIn(
          keyPath,
          emptyMap(),
          function(m) {
            return typeof m.mergeDeep === "function" ? m.mergeDeep.apply(m, iters) : iters[iters.length - 1];
          }
        );
      };
      Map4.prototype.sort = function(comparator) {
        return OrderedMap(sortFactory(this, comparator));
      };
      Map4.prototype.sortBy = function(mapper, comparator) {
        return OrderedMap(sortFactory(this, comparator, mapper));
      };
      Map4.prototype.withMutations = function(fn) {
        var mutable = this.asMutable();
        fn(mutable);
        return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
      };
      Map4.prototype.asMutable = function() {
        return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
      };
      Map4.prototype.asImmutable = function() {
        return this.__ensureOwner();
      };
      Map4.prototype.wasAltered = function() {
        return this.__altered;
      };
      Map4.prototype.__iterator = function(type, reverse) {
        return new MapIterator(this, type, reverse);
      };
      Map4.prototype.__iterate = function(fn, reverse) {
        var this$0 = this;
        var iterations = 0;
        this._root && this._root.iterate(function(entry) {
          iterations++;
          return fn(entry[1], entry[0], this$0);
        }, reverse);
        return iterations;
      };
      Map4.prototype.__ensureOwner = function(ownerID) {
        if (ownerID === this.__ownerID) {
          return this;
        }
        if (!ownerID) {
          this.__ownerID = ownerID;
          this.__altered = false;
          return this;
        }
        return makeMap(this.size, this._root, ownerID, this.__hash);
      };
      function isMap(maybeMap) {
        return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
      }
      Map4.isMap = isMap;
      var IS_MAP_SENTINEL = "@@__IMMUTABLE_MAP__@@";
      var MapPrototype = Map4.prototype;
      MapPrototype[IS_MAP_SENTINEL] = true;
      MapPrototype[DELETE] = MapPrototype.remove;
      MapPrototype.removeIn = MapPrototype.deleteIn;
      function ArrayMapNode(ownerID, entries) {
        this.ownerID = ownerID;
        this.entries = entries;
      }
      ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
        var entries = this.entries;
        for (var ii = 0, len = entries.length; ii < len; ii++) {
          if (is(key, entries[ii][0])) {
            return entries[ii][1];
          }
        }
        return notSetValue;
      };
      ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        var removed = value === NOT_SET;
        var entries = this.entries;
        var idx = 0;
        for (var len = entries.length; idx < len; idx++) {
          if (is(key, entries[idx][0])) {
            break;
          }
        }
        var exists = idx < len;
        if (exists ? entries[idx][1] === value : removed) {
          return this;
        }
        SetRef(didAlter);
        (removed || !exists) && SetRef(didChangeSize);
        if (removed && entries.length === 1) {
          return;
        }
        if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
          return createNodes(ownerID, entries, key, value);
        }
        var isEditable = ownerID && ownerID === this.ownerID;
        var newEntries = isEditable ? entries : arrCopy(entries);
        if (exists) {
          if (removed) {
            idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop();
          } else {
            newEntries[idx] = [key, value];
          }
        } else {
          newEntries.push([key, value]);
        }
        if (isEditable) {
          this.entries = newEntries;
          return this;
        }
        return new ArrayMapNode(ownerID, newEntries);
      };
      function BitmapIndexedNode(ownerID, bitmap, nodes) {
        this.ownerID = ownerID;
        this.bitmap = bitmap;
        this.nodes = nodes;
      }
      BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
        if (keyHash === void 0) {
          keyHash = hash(key);
        }
        var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
        var bitmap = this.bitmap;
        return (bitmap & bit) === 0 ? notSetValue : this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT, keyHash, key, notSetValue);
      };
      BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === void 0) {
          keyHash = hash(key);
        }
        var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var bit = 1 << keyHashFrag;
        var bitmap = this.bitmap;
        var exists = (bitmap & bit) !== 0;
        if (!exists && value === NOT_SET) {
          return this;
        }
        var idx = popCount(bitmap & bit - 1);
        var nodes = this.nodes;
        var node = exists ? nodes[idx] : void 0;
        var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
        if (newNode === node) {
          return this;
        }
        if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
          return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
        }
        if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
          return nodes[idx ^ 1];
        }
        if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
          return newNode;
        }
        var isEditable = ownerID && ownerID === this.ownerID;
        var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
        var newNodes = exists ? newNode ? setIn(nodes, idx, newNode, isEditable) : spliceOut(nodes, idx, isEditable) : spliceIn(nodes, idx, newNode, isEditable);
        if (isEditable) {
          this.bitmap = newBitmap;
          this.nodes = newNodes;
          return this;
        }
        return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
      };
      function HashArrayMapNode(ownerID, count, nodes) {
        this.ownerID = ownerID;
        this.count = count;
        this.nodes = nodes;
      }
      HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
        if (keyHash === void 0) {
          keyHash = hash(key);
        }
        var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var node = this.nodes[idx];
        return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
      };
      HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === void 0) {
          keyHash = hash(key);
        }
        var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var removed = value === NOT_SET;
        var nodes = this.nodes;
        var node = nodes[idx];
        if (removed && !node) {
          return this;
        }
        var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
        if (newNode === node) {
          return this;
        }
        var newCount = this.count;
        if (!node) {
          newCount++;
        } else if (!newNode) {
          newCount--;
          if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
            return packNodes(ownerID, nodes, newCount, idx);
          }
        }
        var isEditable = ownerID && ownerID === this.ownerID;
        var newNodes = setIn(nodes, idx, newNode, isEditable);
        if (isEditable) {
          this.count = newCount;
          this.nodes = newNodes;
          return this;
        }
        return new HashArrayMapNode(ownerID, newCount, newNodes);
      };
      function HashCollisionNode(ownerID, keyHash, entries) {
        this.ownerID = ownerID;
        this.keyHash = keyHash;
        this.entries = entries;
      }
      HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
        var entries = this.entries;
        for (var ii = 0, len = entries.length; ii < len; ii++) {
          if (is(key, entries[ii][0])) {
            return entries[ii][1];
          }
        }
        return notSetValue;
      };
      HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === void 0) {
          keyHash = hash(key);
        }
        var removed = value === NOT_SET;
        if (keyHash !== this.keyHash) {
          if (removed) {
            return this;
          }
          SetRef(didAlter);
          SetRef(didChangeSize);
          return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
        }
        var entries = this.entries;
        var idx = 0;
        for (var len = entries.length; idx < len; idx++) {
          if (is(key, entries[idx][0])) {
            break;
          }
        }
        var exists = idx < len;
        if (exists ? entries[idx][1] === value : removed) {
          return this;
        }
        SetRef(didAlter);
        (removed || !exists) && SetRef(didChangeSize);
        if (removed && len === 2) {
          return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
        }
        var isEditable = ownerID && ownerID === this.ownerID;
        var newEntries = isEditable ? entries : arrCopy(entries);
        if (exists) {
          if (removed) {
            idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop();
          } else {
            newEntries[idx] = [key, value];
          }
        } else {
          newEntries.push([key, value]);
        }
        if (isEditable) {
          this.entries = newEntries;
          return this;
        }
        return new HashCollisionNode(ownerID, this.keyHash, newEntries);
      };
      function ValueNode(ownerID, keyHash, entry) {
        this.ownerID = ownerID;
        this.keyHash = keyHash;
        this.entry = entry;
      }
      ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
        return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
      };
      ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        var removed = value === NOT_SET;
        var keyMatch = is(key, this.entry[0]);
        if (keyMatch ? value === this.entry[1] : removed) {
          return this;
        }
        SetRef(didAlter);
        if (removed) {
          SetRef(didChangeSize);
          return;
        }
        if (keyMatch) {
          if (ownerID && ownerID === this.ownerID) {
            this.entry[1] = value;
            return this;
          }
          return new ValueNode(ownerID, this.keyHash, [key, value]);
        }
        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
      };
      ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function(fn, reverse) {
        var entries = this.entries;
        for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
          if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
            return false;
          }
        }
      };
      BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function(fn, reverse) {
        var nodes = this.nodes;
        for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
          var node = nodes[reverse ? maxIndex - ii : ii];
          if (node && node.iterate(fn, reverse) === false) {
            return false;
          }
        }
      };
      ValueNode.prototype.iterate = function(fn, reverse) {
        return fn(this.entry);
      };
      createClass(MapIterator, Iterator);
      function MapIterator(map, type, reverse) {
        this._type = type;
        this._reverse = reverse;
        this._stack = map._root && mapIteratorFrame(map._root);
      }
      MapIterator.prototype.next = function() {
        var type = this._type;
        var stack = this._stack;
        while (stack) {
          var node = stack.node;
          var index = stack.index++;
          var maxIndex;
          if (node.entry) {
            if (index === 0) {
              return mapIteratorValue(type, node.entry);
            }
          } else if (node.entries) {
            maxIndex = node.entries.length - 1;
            if (index <= maxIndex) {
              return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
            }
          } else {
            maxIndex = node.nodes.length - 1;
            if (index <= maxIndex) {
              var subNode = node.nodes[this._reverse ? maxIndex - index : index];
              if (subNode) {
                if (subNode.entry) {
                  return mapIteratorValue(type, subNode.entry);
                }
                stack = this._stack = mapIteratorFrame(subNode, stack);
              }
              continue;
            }
          }
          stack = this._stack = this._stack.__prev;
        }
        return iteratorDone();
      };
      function mapIteratorValue(type, entry) {
        return iteratorValue(type, entry[0], entry[1]);
      }
      function mapIteratorFrame(node, prev) {
        return {
          node,
          index: 0,
          __prev: prev
        };
      }
      function makeMap(size, root, ownerID, hash2) {
        var map = Object.create(MapPrototype);
        map.size = size;
        map._root = root;
        map.__ownerID = ownerID;
        map.__hash = hash2;
        map.__altered = false;
        return map;
      }
      var EMPTY_MAP;
      function emptyMap() {
        return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
      }
      function updateMap(map, k, v) {
        var newRoot;
        var newSize;
        if (!map._root) {
          if (v === NOT_SET) {
            return map;
          }
          newSize = 1;
          newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
        } else {
          var didChangeSize = MakeRef(CHANGE_LENGTH);
          var didAlter = MakeRef(DID_ALTER);
          newRoot = updateNode(map._root, map.__ownerID, 0, void 0, k, v, didChangeSize, didAlter);
          if (!didAlter.value) {
            return map;
          }
          newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
        }
        if (map.__ownerID) {
          map.size = newSize;
          map._root = newRoot;
          map.__hash = void 0;
          map.__altered = true;
          return map;
        }
        return newRoot ? makeMap(newSize, newRoot) : emptyMap();
      }
      function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (!node) {
          if (value === NOT_SET) {
            return node;
          }
          SetRef(didAlter);
          SetRef(didChangeSize);
          return new ValueNode(ownerID, keyHash, [key, value]);
        }
        return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
      }
      function isLeafNode(node) {
        return node.constructor === ValueNode || node.constructor === HashCollisionNode;
      }
      function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
        if (node.keyHash === keyHash) {
          return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
        }
        var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
        var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var newNode;
        var nodes = idx1 === idx2 ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] : (newNode = new ValueNode(ownerID, keyHash, entry), idx1 < idx2 ? [node, newNode] : [newNode, node]);
        return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes);
      }
      function createNodes(ownerID, entries, key, value) {
        if (!ownerID) {
          ownerID = new OwnerID();
        }
        var node = new ValueNode(ownerID, hash(key), [key, value]);
        for (var ii = 0; ii < entries.length; ii++) {
          var entry = entries[ii];
          node = node.update(ownerID, 0, void 0, entry[0], entry[1]);
        }
        return node;
      }
      function packNodes(ownerID, nodes, count, excluding) {
        var bitmap = 0;
        var packedII = 0;
        var packedNodes = new Array(count);
        for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
          var node = nodes[ii];
          if (node !== void 0 && ii !== excluding) {
            bitmap |= bit;
            packedNodes[packedII++] = node;
          }
        }
        return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
      }
      function expandNodes(ownerID, nodes, bitmap, including, node) {
        var count = 0;
        var expandedNodes = new Array(SIZE);
        for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
          expandedNodes[ii] = bitmap & 1 ? nodes[count++] : void 0;
        }
        expandedNodes[including] = node;
        return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
      }
      function mergeIntoMapWith(map, merger, iterables) {
        var iters = [];
        for (var ii = 0; ii < iterables.length; ii++) {
          var value = iterables[ii];
          var iter = KeyedIterable(value);
          if (!isIterable(value)) {
            iter = iter.map(function(v) {
              return fromJS(v);
            });
          }
          iters.push(iter);
        }
        return mergeIntoCollectionWith(map, merger, iters);
      }
      function deepMerger(existing, value, key) {
        return existing && existing.mergeDeep && isIterable(value) ? existing.mergeDeep(value) : is(existing, value) ? existing : value;
      }
      function deepMergerWith(merger) {
        return function(existing, value, key) {
          if (existing && existing.mergeDeepWith && isIterable(value)) {
            return existing.mergeDeepWith(merger, value);
          }
          var nextValue = merger(existing, value, key);
          return is(existing, nextValue) ? existing : nextValue;
        };
      }
      function mergeIntoCollectionWith(collection, merger, iters) {
        iters = iters.filter(function(x) {
          return x.size !== 0;
        });
        if (iters.length === 0) {
          return collection;
        }
        if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
          return collection.constructor(iters[0]);
        }
        return collection.withMutations(function(collection2) {
          var mergeIntoMap = merger ? function(value, key) {
            collection2.update(
              key,
              NOT_SET,
              function(existing) {
                return existing === NOT_SET ? value : merger(existing, value, key);
              }
            );
          } : function(value, key) {
            collection2.set(key, value);
          };
          for (var ii = 0; ii < iters.length; ii++) {
            iters[ii].forEach(mergeIntoMap);
          }
        });
      }
      function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
        var isNotSet = existing === NOT_SET;
        var step = keyPathIter.next();
        if (step.done) {
          var existingValue = isNotSet ? notSetValue : existing;
          var newValue = updater(existingValue);
          return newValue === existingValue ? existing : newValue;
        }
        invariant(
          isNotSet || existing && existing.set,
          "invalid keyPath"
        );
        var key = step.value;
        var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
        var nextUpdated = updateInDeepMap(
          nextExisting,
          keyPathIter,
          notSetValue,
          updater
        );
        return nextUpdated === nextExisting ? existing : nextUpdated === NOT_SET ? existing.remove(key) : (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
      }
      function popCount(x) {
        x = x - (x >> 1 & 1431655765);
        x = (x & 858993459) + (x >> 2 & 858993459);
        x = x + (x >> 4) & 252645135;
        x = x + (x >> 8);
        x = x + (x >> 16);
        return x & 127;
      }
      function setIn(array, idx, val, canEdit) {
        var newArray = canEdit ? array : arrCopy(array);
        newArray[idx] = val;
        return newArray;
      }
      function spliceIn(array, idx, val, canEdit) {
        var newLen = array.length + 1;
        if (canEdit && idx + 1 === newLen) {
          array[idx] = val;
          return array;
        }
        var newArray = new Array(newLen);
        var after = 0;
        for (var ii = 0; ii < newLen; ii++) {
          if (ii === idx) {
            newArray[ii] = val;
            after = -1;
          } else {
            newArray[ii] = array[ii + after];
          }
        }
        return newArray;
      }
      function spliceOut(array, idx, canEdit) {
        var newLen = array.length - 1;
        if (canEdit && idx === newLen) {
          array.pop();
          return array;
        }
        var newArray = new Array(newLen);
        var after = 0;
        for (var ii = 0; ii < newLen; ii++) {
          if (ii === idx) {
            after = 1;
          }
          newArray[ii] = array[ii + after];
        }
        return newArray;
      }
      var MAX_ARRAY_MAP_SIZE = SIZE / 4;
      var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
      var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;
      createClass(List2, IndexedCollection);
      function List2(value) {
        var empty = emptyList();
        if (value === null || value === void 0) {
          return empty;
        }
        if (isList(value)) {
          return value;
        }
        var iter = IndexedIterable(value);
        var size = iter.size;
        if (size === 0) {
          return empty;
        }
        assertNotInfinite(size);
        if (size > 0 && size < SIZE) {
          return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
        }
        return empty.withMutations(function(list) {
          list.setSize(size);
          iter.forEach(function(v, i) {
            return list.set(i, v);
          });
        });
      }
      List2.of = function() {
        return this(arguments);
      };
      List2.prototype.toString = function() {
        return this.__toString("List [", "]");
      };
      List2.prototype.get = function(index, notSetValue) {
        index = wrapIndex(this, index);
        if (index >= 0 && index < this.size) {
          index += this._origin;
          var node = listNodeFor(this, index);
          return node && node.array[index & MASK];
        }
        return notSetValue;
      };
      List2.prototype.set = function(index, value) {
        return updateList(this, index, value);
      };
      List2.prototype.remove = function(index) {
        return !this.has(index) ? this : index === 0 ? this.shift() : index === this.size - 1 ? this.pop() : this.splice(index, 1);
      };
      List2.prototype.insert = function(index, value) {
        return this.splice(index, 0, value);
      };
      List2.prototype.clear = function() {
        if (this.size === 0) {
          return this;
        }
        if (this.__ownerID) {
          this.size = this._origin = this._capacity = 0;
          this._level = SHIFT;
          this._root = this._tail = null;
          this.__hash = void 0;
          this.__altered = true;
          return this;
        }
        return emptyList();
      };
      List2.prototype.push = function() {
        var values = arguments;
        var oldSize = this.size;
        return this.withMutations(function(list) {
          setListBounds(list, 0, oldSize + values.length);
          for (var ii = 0; ii < values.length; ii++) {
            list.set(oldSize + ii, values[ii]);
          }
        });
      };
      List2.prototype.pop = function() {
        return setListBounds(this, 0, -1);
      };
      List2.prototype.unshift = function() {
        var values = arguments;
        return this.withMutations(function(list) {
          setListBounds(list, -values.length);
          for (var ii = 0; ii < values.length; ii++) {
            list.set(ii, values[ii]);
          }
        });
      };
      List2.prototype.shift = function() {
        return setListBounds(this, 1);
      };
      List2.prototype.merge = function() {
        return mergeIntoListWith(this, void 0, arguments);
      };
      List2.prototype.mergeWith = function(merger) {
        var iters = SLICE$0.call(arguments, 1);
        return mergeIntoListWith(this, merger, iters);
      };
      List2.prototype.mergeDeep = function() {
        return mergeIntoListWith(this, deepMerger, arguments);
      };
      List2.prototype.mergeDeepWith = function(merger) {
        var iters = SLICE$0.call(arguments, 1);
        return mergeIntoListWith(this, deepMergerWith(merger), iters);
      };
      List2.prototype.setSize = function(size) {
        return setListBounds(this, 0, size);
      };
      List2.prototype.slice = function(begin, end) {
        var size = this.size;
        if (wholeSlice(begin, end, size)) {
          return this;
        }
        return setListBounds(
          this,
          resolveBegin(begin, size),
          resolveEnd(end, size)
        );
      };
      List2.prototype.__iterator = function(type, reverse) {
        var index = 0;
        var values = iterateList(this, reverse);
        return new Iterator(function() {
          var value = values();
          return value === DONE ? iteratorDone() : iteratorValue(type, index++, value);
        });
      };
      List2.prototype.__iterate = function(fn, reverse) {
        var index = 0;
        var values = iterateList(this, reverse);
        var value;
        while ((value = values()) !== DONE) {
          if (fn(value, index++, this) === false) {
            break;
          }
        }
        return index;
      };
      List2.prototype.__ensureOwner = function(ownerID) {
        if (ownerID === this.__ownerID) {
          return this;
        }
        if (!ownerID) {
          this.__ownerID = ownerID;
          return this;
        }
        return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
      };
      function isList(maybeList) {
        return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
      }
      List2.isList = isList;
      var IS_LIST_SENTINEL = "@@__IMMUTABLE_LIST__@@";
      var ListPrototype = List2.prototype;
      ListPrototype[IS_LIST_SENTINEL] = true;
      ListPrototype[DELETE] = ListPrototype.remove;
      ListPrototype.setIn = MapPrototype.setIn;
      ListPrototype.deleteIn = ListPrototype.removeIn = MapPrototype.removeIn;
      ListPrototype.update = MapPrototype.update;
      ListPrototype.updateIn = MapPrototype.updateIn;
      ListPrototype.mergeIn = MapPrototype.mergeIn;
      ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
      ListPrototype.withMutations = MapPrototype.withMutations;
      ListPrototype.asMutable = MapPrototype.asMutable;
      ListPrototype.asImmutable = MapPrototype.asImmutable;
      ListPrototype.wasAltered = MapPrototype.wasAltered;
      function VNode(array, ownerID) {
        this.array = array;
        this.ownerID = ownerID;
      }
      VNode.prototype.removeBefore = function(ownerID, level, index) {
        if (index === level ? 1 << level : this.array.length === 0) {
          return this;
        }
        var originIndex = index >>> level & MASK;
        if (originIndex >= this.array.length) {
          return new VNode([], ownerID);
        }
        var removingFirst = originIndex === 0;
        var newChild;
        if (level > 0) {
          var oldChild = this.array[originIndex];
          newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
          if (newChild === oldChild && removingFirst) {
            return this;
          }
        }
        if (removingFirst && !newChild) {
          return this;
        }
        var editable = editableVNode(this, ownerID);
        if (!removingFirst) {
          for (var ii = 0; ii < originIndex; ii++) {
            editable.array[ii] = void 0;
          }
        }
        if (newChild) {
          editable.array[originIndex] = newChild;
        }
        return editable;
      };
      VNode.prototype.removeAfter = function(ownerID, level, index) {
        if (index === (level ? 1 << level : 0) || this.array.length === 0) {
          return this;
        }
        var sizeIndex = index - 1 >>> level & MASK;
        if (sizeIndex >= this.array.length) {
          return this;
        }
        var newChild;
        if (level > 0) {
          var oldChild = this.array[sizeIndex];
          newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
          if (newChild === oldChild && sizeIndex === this.array.length - 1) {
            return this;
          }
        }
        var editable = editableVNode(this, ownerID);
        editable.array.splice(sizeIndex + 1);
        if (newChild) {
          editable.array[sizeIndex] = newChild;
        }
        return editable;
      };
      var DONE = {};
      function iterateList(list, reverse) {
        var left = list._origin;
        var right = list._capacity;
        var tailPos = getTailOffset(right);
        var tail = list._tail;
        return iterateNodeOrLeaf(list._root, list._level, 0);
        function iterateNodeOrLeaf(node, level, offset) {
          return level === 0 ? iterateLeaf(node, offset) : iterateNode(node, level, offset);
        }
        function iterateLeaf(node, offset) {
          var array = offset === tailPos ? tail && tail.array : node && node.array;
          var from = offset > left ? 0 : left - offset;
          var to = right - offset;
          if (to > SIZE) {
            to = SIZE;
          }
          return function() {
            if (from === to) {
              return DONE;
            }
            var idx = reverse ? --to : from++;
            return array && array[idx];
          };
        }
        function iterateNode(node, level, offset) {
          var values;
          var array = node && node.array;
          var from = offset > left ? 0 : left - offset >> level;
          var to = (right - offset >> level) + 1;
          if (to > SIZE) {
            to = SIZE;
          }
          return function() {
            do {
              if (values) {
                var value = values();
                if (value !== DONE) {
                  return value;
                }
                values = null;
              }
              if (from === to) {
                return DONE;
              }
              var idx = reverse ? --to : from++;
              values = iterateNodeOrLeaf(
                array && array[idx],
                level - SHIFT,
                offset + (idx << level)
              );
            } while (true);
          };
        }
      }
      function makeList(origin, capacity, level, root, tail, ownerID, hash2) {
        var list = Object.create(ListPrototype);
        list.size = capacity - origin;
        list._origin = origin;
        list._capacity = capacity;
        list._level = level;
        list._root = root;
        list._tail = tail;
        list.__ownerID = ownerID;
        list.__hash = hash2;
        list.__altered = false;
        return list;
      }
      var EMPTY_LIST;
      function emptyList() {
        return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
      }
      function updateList(list, index, value) {
        index = wrapIndex(list, index);
        if (index !== index) {
          return list;
        }
        if (index >= list.size || index < 0) {
          return list.withMutations(function(list2) {
            index < 0 ? setListBounds(list2, index).set(0, value) : setListBounds(list2, 0, index + 1).set(index, value);
          });
        }
        index += list._origin;
        var newTail = list._tail;
        var newRoot = list._root;
        var didAlter = MakeRef(DID_ALTER);
        if (index >= getTailOffset(list._capacity)) {
          newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
        } else {
          newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
        }
        if (!didAlter.value) {
          return list;
        }
        if (list.__ownerID) {
          list._root = newRoot;
          list._tail = newTail;
          list.__hash = void 0;
          list.__altered = true;
          return list;
        }
        return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
      }
      function updateVNode(node, ownerID, level, index, value, didAlter) {
        var idx = index >>> level & MASK;
        var nodeHas = node && idx < node.array.length;
        if (!nodeHas && value === void 0) {
          return node;
        }
        var newNode;
        if (level > 0) {
          var lowerNode = node && node.array[idx];
          var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
          if (newLowerNode === lowerNode) {
            return node;
          }
          newNode = editableVNode(node, ownerID);
          newNode.array[idx] = newLowerNode;
          return newNode;
        }
        if (nodeHas && node.array[idx] === value) {
          return node;
        }
        SetRef(didAlter);
        newNode = editableVNode(node, ownerID);
        if (value === void 0 && idx === newNode.array.length - 1) {
          newNode.array.pop();
        } else {
          newNode.array[idx] = value;
        }
        return newNode;
      }
      function editableVNode(node, ownerID) {
        if (ownerID && node && ownerID === node.ownerID) {
          return node;
        }
        return new VNode(node ? node.array.slice() : [], ownerID);
      }
      function listNodeFor(list, rawIndex) {
        if (rawIndex >= getTailOffset(list._capacity)) {
          return list._tail;
        }
        if (rawIndex < 1 << list._level + SHIFT) {
          var node = list._root;
          var level = list._level;
          while (node && level > 0) {
            node = node.array[rawIndex >>> level & MASK];
            level -= SHIFT;
          }
          return node;
        }
      }
      function setListBounds(list, begin, end) {
        if (begin !== void 0) {
          begin = begin | 0;
        }
        if (end !== void 0) {
          end = end | 0;
        }
        var owner = list.__ownerID || new OwnerID();
        var oldOrigin = list._origin;
        var oldCapacity = list._capacity;
        var newOrigin = oldOrigin + begin;
        var newCapacity = end === void 0 ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
        if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
          return list;
        }
        if (newOrigin >= newCapacity) {
          return list.clear();
        }
        var newLevel = list._level;
        var newRoot = list._root;
        var offsetShift = 0;
        while (newOrigin + offsetShift < 0) {
          newRoot = new VNode(newRoot && newRoot.array.length ? [void 0, newRoot] : [], owner);
          newLevel += SHIFT;
          offsetShift += 1 << newLevel;
        }
        if (offsetShift) {
          newOrigin += offsetShift;
          oldOrigin += offsetShift;
          newCapacity += offsetShift;
          oldCapacity += offsetShift;
        }
        var oldTailOffset = getTailOffset(oldCapacity);
        var newTailOffset = getTailOffset(newCapacity);
        while (newTailOffset >= 1 << newLevel + SHIFT) {
          newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
          newLevel += SHIFT;
        }
        var oldTail = list._tail;
        var newTail = newTailOffset < oldTailOffset ? listNodeFor(list, newCapacity - 1) : newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;
        if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
          newRoot = editableVNode(newRoot, owner);
          var node = newRoot;
          for (var level = newLevel; level > SHIFT; level -= SHIFT) {
            var idx = oldTailOffset >>> level & MASK;
            node = node.array[idx] = editableVNode(node.array[idx], owner);
          }
          node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;
        }
        if (newCapacity < oldCapacity) {
          newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
        }
        if (newOrigin >= newTailOffset) {
          newOrigin -= newTailOffset;
          newCapacity -= newTailOffset;
          newLevel = SHIFT;
          newRoot = null;
          newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);
        } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
          offsetShift = 0;
          while (newRoot) {
            var beginIndex = newOrigin >>> newLevel & MASK;
            if (beginIndex !== newTailOffset >>> newLevel & MASK) {
              break;
            }
            if (beginIndex) {
              offsetShift += (1 << newLevel) * beginIndex;
            }
            newLevel -= SHIFT;
            newRoot = newRoot.array[beginIndex];
          }
          if (newRoot && newOrigin > oldOrigin) {
            newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
          }
          if (newRoot && newTailOffset < oldTailOffset) {
            newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
          }
          if (offsetShift) {
            newOrigin -= offsetShift;
            newCapacity -= offsetShift;
          }
        }
        if (list.__ownerID) {
          list.size = newCapacity - newOrigin;
          list._origin = newOrigin;
          list._capacity = newCapacity;
          list._level = newLevel;
          list._root = newRoot;
          list._tail = newTail;
          list.__hash = void 0;
          list.__altered = true;
          return list;
        }
        return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
      }
      function mergeIntoListWith(list, merger, iterables) {
        var iters = [];
        var maxSize = 0;
        for (var ii = 0; ii < iterables.length; ii++) {
          var value = iterables[ii];
          var iter = IndexedIterable(value);
          if (iter.size > maxSize) {
            maxSize = iter.size;
          }
          if (!isIterable(value)) {
            iter = iter.map(function(v) {
              return fromJS(v);
            });
          }
          iters.push(iter);
        }
        if (maxSize > list.size) {
          list = list.setSize(maxSize);
        }
        return mergeIntoCollectionWith(list, merger, iters);
      }
      function getTailOffset(size) {
        return size < SIZE ? 0 : size - 1 >>> SHIFT << SHIFT;
      }
      createClass(OrderedMap, Map4);
      function OrderedMap(value) {
        return value === null || value === void 0 ? emptyOrderedMap() : isOrderedMap(value) ? value : emptyOrderedMap().withMutations(function(map) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k) {
            return map.set(k, v);
          });
        });
      }
      OrderedMap.of = function() {
        return this(arguments);
      };
      OrderedMap.prototype.toString = function() {
        return this.__toString("OrderedMap {", "}");
      };
      OrderedMap.prototype.get = function(k, notSetValue) {
        var index = this._map.get(k);
        return index !== void 0 ? this._list.get(index)[1] : notSetValue;
      };
      OrderedMap.prototype.clear = function() {
        if (this.size === 0) {
          return this;
        }
        if (this.__ownerID) {
          this.size = 0;
          this._map.clear();
          this._list.clear();
          return this;
        }
        return emptyOrderedMap();
      };
      OrderedMap.prototype.set = function(k, v) {
        return updateOrderedMap(this, k, v);
      };
      OrderedMap.prototype.remove = function(k) {
        return updateOrderedMap(this, k, NOT_SET);
      };
      OrderedMap.prototype.wasAltered = function() {
        return this._map.wasAltered() || this._list.wasAltered();
      };
      OrderedMap.prototype.__iterate = function(fn, reverse) {
        var this$0 = this;
        return this._list.__iterate(
          function(entry) {
            return entry && fn(entry[1], entry[0], this$0);
          },
          reverse
        );
      };
      OrderedMap.prototype.__iterator = function(type, reverse) {
        return this._list.fromEntrySeq().__iterator(type, reverse);
      };
      OrderedMap.prototype.__ensureOwner = function(ownerID) {
        if (ownerID === this.__ownerID) {
          return this;
        }
        var newMap = this._map.__ensureOwner(ownerID);
        var newList = this._list.__ensureOwner(ownerID);
        if (!ownerID) {
          this.__ownerID = ownerID;
          this._map = newMap;
          this._list = newList;
          return this;
        }
        return makeOrderedMap(newMap, newList, ownerID, this.__hash);
      };
      function isOrderedMap(maybeOrderedMap) {
        return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
      }
      OrderedMap.isOrderedMap = isOrderedMap;
      OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
      OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;
      function makeOrderedMap(map, list, ownerID, hash2) {
        var omap = Object.create(OrderedMap.prototype);
        omap.size = map ? map.size : 0;
        omap._map = map;
        omap._list = list;
        omap.__ownerID = ownerID;
        omap.__hash = hash2;
        return omap;
      }
      var EMPTY_ORDERED_MAP;
      function emptyOrderedMap() {
        return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
      }
      function updateOrderedMap(omap, k, v) {
        var map = omap._map;
        var list = omap._list;
        var i = map.get(k);
        var has = i !== void 0;
        var newMap;
        var newList;
        if (v === NOT_SET) {
          if (!has) {
            return omap;
          }
          if (list.size >= SIZE && list.size >= map.size * 2) {
            newList = list.filter(function(entry, idx) {
              return entry !== void 0 && i !== idx;
            });
            newMap = newList.toKeyedSeq().map(function(entry) {
              return entry[0];
            }).flip().toMap();
            if (omap.__ownerID) {
              newMap.__ownerID = newList.__ownerID = omap.__ownerID;
            }
          } else {
            newMap = map.remove(k);
            newList = i === list.size - 1 ? list.pop() : list.set(i, void 0);
          }
        } else {
          if (has) {
            if (v === list.get(i)[1]) {
              return omap;
            }
            newMap = map;
            newList = list.set(i, [k, v]);
          } else {
            newMap = map.set(k, list.size);
            newList = list.set(list.size, [k, v]);
          }
        }
        if (omap.__ownerID) {
          omap.size = newMap.size;
          omap._map = newMap;
          omap._list = newList;
          omap.__hash = void 0;
          return omap;
        }
        return makeOrderedMap(newMap, newList);
      }
      createClass(ToKeyedSequence, KeyedSeq);
      function ToKeyedSequence(indexed, useKeys) {
        this._iter = indexed;
        this._useKeys = useKeys;
        this.size = indexed.size;
      }
      ToKeyedSequence.prototype.get = function(key, notSetValue) {
        return this._iter.get(key, notSetValue);
      };
      ToKeyedSequence.prototype.has = function(key) {
        return this._iter.has(key);
      };
      ToKeyedSequence.prototype.valueSeq = function() {
        return this._iter.valueSeq();
      };
      ToKeyedSequence.prototype.reverse = function() {
        var this$0 = this;
        var reversedSequence = reverseFactory(this, true);
        if (!this._useKeys) {
          reversedSequence.valueSeq = function() {
            return this$0._iter.toSeq().reverse();
          };
        }
        return reversedSequence;
      };
      ToKeyedSequence.prototype.map = function(mapper, context) {
        var this$0 = this;
        var mappedSequence = mapFactory(this, mapper, context);
        if (!this._useKeys) {
          mappedSequence.valueSeq = function() {
            return this$0._iter.toSeq().map(mapper, context);
          };
        }
        return mappedSequence;
      };
      ToKeyedSequence.prototype.__iterate = function(fn, reverse) {
        var this$0 = this;
        var ii;
        return this._iter.__iterate(
          this._useKeys ? function(v, k) {
            return fn(v, k, this$0);
          } : (ii = reverse ? resolveSize(this) : 0, function(v) {
            return fn(v, reverse ? --ii : ii++, this$0);
          }),
          reverse
        );
      };
      ToKeyedSequence.prototype.__iterator = function(type, reverse) {
        if (this._useKeys) {
          return this._iter.__iterator(type, reverse);
        }
        var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
        var ii = reverse ? resolveSize(this) : 0;
        return new Iterator(function() {
          var step = iterator.next();
          return step.done ? step : iteratorValue(type, reverse ? --ii : ii++, step.value, step);
        });
      };
      ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;
      createClass(ToIndexedSequence, IndexedSeq);
      function ToIndexedSequence(iter) {
        this._iter = iter;
        this.size = iter.size;
      }
      ToIndexedSequence.prototype.includes = function(value) {
        return this._iter.includes(value);
      };
      ToIndexedSequence.prototype.__iterate = function(fn, reverse) {
        var this$0 = this;
        var iterations = 0;
        return this._iter.__iterate(function(v) {
          return fn(v, iterations++, this$0);
        }, reverse);
      };
      ToIndexedSequence.prototype.__iterator = function(type, reverse) {
        var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
        var iterations = 0;
        return new Iterator(function() {
          var step = iterator.next();
          return step.done ? step : iteratorValue(type, iterations++, step.value, step);
        });
      };
      createClass(ToSetSequence, SetSeq);
      function ToSetSequence(iter) {
        this._iter = iter;
        this.size = iter.size;
      }
      ToSetSequence.prototype.has = function(key) {
        return this._iter.includes(key);
      };
      ToSetSequence.prototype.__iterate = function(fn, reverse) {
        var this$0 = this;
        return this._iter.__iterate(function(v) {
          return fn(v, v, this$0);
        }, reverse);
      };
      ToSetSequence.prototype.__iterator = function(type, reverse) {
        var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
        return new Iterator(function() {
          var step = iterator.next();
          return step.done ? step : iteratorValue(type, step.value, step.value, step);
        });
      };
      createClass(FromEntriesSequence, KeyedSeq);
      function FromEntriesSequence(entries) {
        this._iter = entries;
        this.size = entries.size;
      }
      FromEntriesSequence.prototype.entrySeq = function() {
        return this._iter.toSeq();
      };
      FromEntriesSequence.prototype.__iterate = function(fn, reverse) {
        var this$0 = this;
        return this._iter.__iterate(function(entry) {
          if (entry) {
            validateEntry(entry);
            var indexedIterable = isIterable(entry);
            return fn(
              indexedIterable ? entry.get(1) : entry[1],
              indexedIterable ? entry.get(0) : entry[0],
              this$0
            );
          }
        }, reverse);
      };
      FromEntriesSequence.prototype.__iterator = function(type, reverse) {
        var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
        return new Iterator(function() {
          while (true) {
            var step = iterator.next();
            if (step.done) {
              return step;
            }
            var entry = step.value;
            if (entry) {
              validateEntry(entry);
              var indexedIterable = isIterable(entry);
              return iteratorValue(
                type,
                indexedIterable ? entry.get(0) : entry[0],
                indexedIterable ? entry.get(1) : entry[1],
                step
              );
            }
          }
        });
      };
      ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;
      function flipFactory(iterable) {
        var flipSequence = makeSequence(iterable);
        flipSequence._iter = iterable;
        flipSequence.size = iterable.size;
        flipSequence.flip = function() {
          return iterable;
        };
        flipSequence.reverse = function() {
          var reversedSequence = iterable.reverse.apply(this);
          reversedSequence.flip = function() {
            return iterable.reverse();
          };
          return reversedSequence;
        };
        flipSequence.has = function(key) {
          return iterable.includes(key);
        };
        flipSequence.includes = function(key) {
          return iterable.has(key);
        };
        flipSequence.cacheResult = cacheResultThrough;
        flipSequence.__iterateUncached = function(fn, reverse) {
          var this$0 = this;
          return iterable.__iterate(function(v, k) {
            return fn(k, v, this$0) !== false;
          }, reverse);
        };
        flipSequence.__iteratorUncached = function(type, reverse) {
          if (type === ITERATE_ENTRIES) {
            var iterator = iterable.__iterator(type, reverse);
            return new Iterator(function() {
              var step = iterator.next();
              if (!step.done) {
                var k = step.value[0];
                step.value[0] = step.value[1];
                step.value[1] = k;
              }
              return step;
            });
          }
          return iterable.__iterator(
            type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
            reverse
          );
        };
        return flipSequence;
      }
      function mapFactory(iterable, mapper, context) {
        var mappedSequence = makeSequence(iterable);
        mappedSequence.size = iterable.size;
        mappedSequence.has = function(key) {
          return iterable.has(key);
        };
        mappedSequence.get = function(key, notSetValue) {
          var v = iterable.get(key, NOT_SET);
          return v === NOT_SET ? notSetValue : mapper.call(context, v, key, iterable);
        };
        mappedSequence.__iterateUncached = function(fn, reverse) {
          var this$0 = this;
          return iterable.__iterate(
            function(v, k, c) {
              return fn(mapper.call(context, v, k, c), k, this$0) !== false;
            },
            reverse
          );
        };
        mappedSequence.__iteratorUncached = function(type, reverse) {
          var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
          return new Iterator(function() {
            var step = iterator.next();
            if (step.done) {
              return step;
            }
            var entry = step.value;
            var key = entry[0];
            return iteratorValue(
              type,
              key,
              mapper.call(context, entry[1], key, iterable),
              step
            );
          });
        };
        return mappedSequence;
      }
      function reverseFactory(iterable, useKeys) {
        var reversedSequence = makeSequence(iterable);
        reversedSequence._iter = iterable;
        reversedSequence.size = iterable.size;
        reversedSequence.reverse = function() {
          return iterable;
        };
        if (iterable.flip) {
          reversedSequence.flip = function() {
            var flipSequence = flipFactory(iterable);
            flipSequence.reverse = function() {
              return iterable.flip();
            };
            return flipSequence;
          };
        }
        reversedSequence.get = function(key, notSetValue) {
          return iterable.get(useKeys ? key : -1 - key, notSetValue);
        };
        reversedSequence.has = function(key) {
          return iterable.has(useKeys ? key : -1 - key);
        };
        reversedSequence.includes = function(value) {
          return iterable.includes(value);
        };
        reversedSequence.cacheResult = cacheResultThrough;
        reversedSequence.__iterate = function(fn, reverse) {
          var this$0 = this;
          return iterable.__iterate(function(v, k) {
            return fn(v, k, this$0);
          }, !reverse);
        };
        reversedSequence.__iterator = function(type, reverse) {
          return iterable.__iterator(type, !reverse);
        };
        return reversedSequence;
      }
      function filterFactory(iterable, predicate, context, useKeys) {
        var filterSequence = makeSequence(iterable);
        if (useKeys) {
          filterSequence.has = function(key) {
            var v = iterable.get(key, NOT_SET);
            return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
          };
          filterSequence.get = function(key, notSetValue) {
            var v = iterable.get(key, NOT_SET);
            return v !== NOT_SET && predicate.call(context, v, key, iterable) ? v : notSetValue;
          };
        }
        filterSequence.__iterateUncached = function(fn, reverse) {
          var this$0 = this;
          var iterations = 0;
          iterable.__iterate(function(v, k, c) {
            if (predicate.call(context, v, k, c)) {
              iterations++;
              return fn(v, useKeys ? k : iterations - 1, this$0);
            }
          }, reverse);
          return iterations;
        };
        filterSequence.__iteratorUncached = function(type, reverse) {
          var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
          var iterations = 0;
          return new Iterator(function() {
            while (true) {
              var step = iterator.next();
              if (step.done) {
                return step;
              }
              var entry = step.value;
              var key = entry[0];
              var value = entry[1];
              if (predicate.call(context, value, key, iterable)) {
                return iteratorValue(type, useKeys ? key : iterations++, value, step);
              }
            }
          });
        };
        return filterSequence;
      }
      function countByFactory(iterable, grouper, context) {
        var groups = Map4().asMutable();
        iterable.__iterate(function(v, k) {
          groups.update(
            grouper.call(context, v, k, iterable),
            0,
            function(a) {
              return a + 1;
            }
          );
        });
        return groups.asImmutable();
      }
      function groupByFactory(iterable, grouper, context) {
        var isKeyedIter = isKeyed(iterable);
        var groups = (isOrdered(iterable) ? OrderedMap() : Map4()).asMutable();
        iterable.__iterate(function(v, k) {
          groups.update(
            grouper.call(context, v, k, iterable),
            function(a) {
              return a = a || [], a.push(isKeyedIter ? [k, v] : v), a;
            }
          );
        });
        var coerce = iterableClass(iterable);
        return groups.map(function(arr) {
          return reify(iterable, coerce(arr));
        });
      }
      function sliceFactory(iterable, begin, end, useKeys) {
        var originalSize = iterable.size;
        if (begin !== void 0) {
          begin = begin | 0;
        }
        if (end !== void 0) {
          if (end === Infinity) {
            end = originalSize;
          } else {
            end = end | 0;
          }
        }
        if (wholeSlice(begin, end, originalSize)) {
          return iterable;
        }
        var resolvedBegin = resolveBegin(begin, originalSize);
        var resolvedEnd = resolveEnd(end, originalSize);
        if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
          return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
        }
        var resolvedSize = resolvedEnd - resolvedBegin;
        var sliceSize;
        if (resolvedSize === resolvedSize) {
          sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
        }
        var sliceSeq = makeSequence(iterable);
        sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || void 0;
        if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
          sliceSeq.get = function(index, notSetValue) {
            index = wrapIndex(this, index);
            return index >= 0 && index < sliceSize ? iterable.get(index + resolvedBegin, notSetValue) : notSetValue;
          };
        }
        sliceSeq.__iterateUncached = function(fn, reverse) {
          var this$0 = this;
          if (sliceSize === 0) {
            return 0;
          }
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse);
          }
          var skipped = 0;
          var isSkipping = true;
          var iterations = 0;
          iterable.__iterate(function(v, k) {
            if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
              iterations++;
              return fn(v, useKeys ? k : iterations - 1, this$0) !== false && iterations !== sliceSize;
            }
          });
          return iterations;
        };
        sliceSeq.__iteratorUncached = function(type, reverse) {
          if (sliceSize !== 0 && reverse) {
            return this.cacheResult().__iterator(type, reverse);
          }
          var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
          var skipped = 0;
          var iterations = 0;
          return new Iterator(function() {
            while (skipped++ < resolvedBegin) {
              iterator.next();
            }
            if (++iterations > sliceSize) {
              return iteratorDone();
            }
            var step = iterator.next();
            if (useKeys || type === ITERATE_VALUES) {
              return step;
            } else if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations - 1, void 0, step);
            } else {
              return iteratorValue(type, iterations - 1, step.value[1], step);
            }
          });
        };
        return sliceSeq;
      }
      function takeWhileFactory(iterable, predicate, context) {
        var takeSequence = makeSequence(iterable);
        takeSequence.__iterateUncached = function(fn, reverse) {
          var this$0 = this;
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse);
          }
          var iterations = 0;
          iterable.__iterate(
            function(v, k, c) {
              return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0);
            }
          );
          return iterations;
        };
        takeSequence.__iteratorUncached = function(type, reverse) {
          var this$0 = this;
          if (reverse) {
            return this.cacheResult().__iterator(type, reverse);
          }
          var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
          var iterating = true;
          return new Iterator(function() {
            if (!iterating) {
              return iteratorDone();
            }
            var step = iterator.next();
            if (step.done) {
              return step;
            }
            var entry = step.value;
            var k = entry[0];
            var v = entry[1];
            if (!predicate.call(context, v, k, this$0)) {
              iterating = false;
              return iteratorDone();
            }
            return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
          });
        };
        return takeSequence;
      }
      function skipWhileFactory(iterable, predicate, context, useKeys) {
        var skipSequence = makeSequence(iterable);
        skipSequence.__iterateUncached = function(fn, reverse) {
          var this$0 = this;
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse);
          }
          var isSkipping = true;
          var iterations = 0;
          iterable.__iterate(function(v, k, c) {
            if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
              iterations++;
              return fn(v, useKeys ? k : iterations - 1, this$0);
            }
          });
          return iterations;
        };
        skipSequence.__iteratorUncached = function(type, reverse) {
          var this$0 = this;
          if (reverse) {
            return this.cacheResult().__iterator(type, reverse);
          }
          var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
          var skipping = true;
          var iterations = 0;
          return new Iterator(function() {
            var step, k, v;
            do {
              step = iterator.next();
              if (step.done) {
                if (useKeys || type === ITERATE_VALUES) {
                  return step;
                } else if (type === ITERATE_KEYS) {
                  return iteratorValue(type, iterations++, void 0, step);
                } else {
                  return iteratorValue(type, iterations++, step.value[1], step);
                }
              }
              var entry = step.value;
              k = entry[0];
              v = entry[1];
              skipping && (skipping = predicate.call(context, v, k, this$0));
            } while (skipping);
            return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
          });
        };
        return skipSequence;
      }
      function concatFactory(iterable, values) {
        var isKeyedIterable = isKeyed(iterable);
        var iters = [iterable].concat(values).map(function(v) {
          if (!isIterable(v)) {
            v = isKeyedIterable ? keyedSeqFromValue(v) : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
          } else if (isKeyedIterable) {
            v = KeyedIterable(v);
          }
          return v;
        }).filter(function(v) {
          return v.size !== 0;
        });
        if (iters.length === 0) {
          return iterable;
        }
        if (iters.length === 1) {
          var singleton = iters[0];
          if (singleton === iterable || isKeyedIterable && isKeyed(singleton) || isIndexed(iterable) && isIndexed(singleton)) {
            return singleton;
          }
        }
        var concatSeq = new ArraySeq(iters);
        if (isKeyedIterable) {
          concatSeq = concatSeq.toKeyedSeq();
        } else if (!isIndexed(iterable)) {
          concatSeq = concatSeq.toSetSeq();
        }
        concatSeq = concatSeq.flatten(true);
        concatSeq.size = iters.reduce(
          function(sum, seq) {
            if (sum !== void 0) {
              var size = seq.size;
              if (size !== void 0) {
                return sum + size;
              }
            }
          },
          0
        );
        return concatSeq;
      }
      function flattenFactory(iterable, depth, useKeys) {
        var flatSequence = makeSequence(iterable);
        flatSequence.__iterateUncached = function(fn, reverse) {
          var iterations = 0;
          var stopped = false;
          function flatDeep(iter, currentDepth) {
            var this$0 = this;
            iter.__iterate(function(v, k) {
              if ((!depth || currentDepth < depth) && isIterable(v)) {
                flatDeep(v, currentDepth + 1);
              } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
                stopped = true;
              }
              return !stopped;
            }, reverse);
          }
          flatDeep(iterable, 0);
          return iterations;
        };
        flatSequence.__iteratorUncached = function(type, reverse) {
          var iterator = iterable.__iterator(type, reverse);
          var stack = [];
          var iterations = 0;
          return new Iterator(function() {
            while (iterator) {
              var step = iterator.next();
              if (step.done !== false) {
                iterator = stack.pop();
                continue;
              }
              var v = step.value;
              if (type === ITERATE_ENTRIES) {
                v = v[1];
              }
              if ((!depth || stack.length < depth) && isIterable(v)) {
                stack.push(iterator);
                iterator = v.__iterator(type, reverse);
              } else {
                return useKeys ? step : iteratorValue(type, iterations++, v, step);
              }
            }
            return iteratorDone();
          });
        };
        return flatSequence;
      }
      function flatMapFactory(iterable, mapper, context) {
        var coerce = iterableClass(iterable);
        return iterable.toSeq().map(
          function(v, k) {
            return coerce(mapper.call(context, v, k, iterable));
          }
        ).flatten(true);
      }
      function interposeFactory(iterable, separator) {
        var interposedSequence = makeSequence(iterable);
        interposedSequence.size = iterable.size && iterable.size * 2 - 1;
        interposedSequence.__iterateUncached = function(fn, reverse) {
          var this$0 = this;
          var iterations = 0;
          iterable.__iterate(
            function(v, k) {
              return (!iterations || fn(separator, iterations++, this$0) !== false) && fn(v, iterations++, this$0) !== false;
            },
            reverse
          );
          return iterations;
        };
        interposedSequence.__iteratorUncached = function(type, reverse) {
          var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
          var iterations = 0;
          var step;
          return new Iterator(function() {
            if (!step || iterations % 2) {
              step = iterator.next();
              if (step.done) {
                return step;
              }
            }
            return iterations % 2 ? iteratorValue(type, iterations++, separator) : iteratorValue(type, iterations++, step.value, step);
          });
        };
        return interposedSequence;
      }
      function sortFactory(iterable, comparator, mapper) {
        if (!comparator) {
          comparator = defaultComparator;
        }
        var isKeyedIterable = isKeyed(iterable);
        var index = 0;
        var entries = iterable.toSeq().map(
          function(v, k) {
            return [k, v, index++, mapper ? mapper(v, k, iterable) : v];
          }
        ).toArray();
        entries.sort(function(a, b) {
          return comparator(a[3], b[3]) || a[2] - b[2];
        }).forEach(
          isKeyedIterable ? function(v, i) {
            entries[i].length = 2;
          } : function(v, i) {
            entries[i] = v[1];
          }
        );
        return isKeyedIterable ? KeyedSeq(entries) : isIndexed(iterable) ? IndexedSeq(entries) : SetSeq(entries);
      }
      function maxFactory(iterable, comparator, mapper) {
        if (!comparator) {
          comparator = defaultComparator;
        }
        if (mapper) {
          var entry = iterable.toSeq().map(function(v, k) {
            return [v, mapper(v, k, iterable)];
          }).reduce(function(a, b) {
            return maxCompare(comparator, a[1], b[1]) ? b : a;
          });
          return entry && entry[0];
        } else {
          return iterable.reduce(function(a, b) {
            return maxCompare(comparator, a, b) ? b : a;
          });
        }
      }
      function maxCompare(comparator, a, b) {
        var comp = comparator(b, a);
        return comp === 0 && b !== a && (b === void 0 || b === null || b !== b) || comp > 0;
      }
      function zipWithFactory(keyIter, zipper, iters) {
        var zipSequence = makeSequence(keyIter);
        zipSequence.size = new ArraySeq(iters).map(function(i) {
          return i.size;
        }).min();
        zipSequence.__iterate = function(fn, reverse) {
          var iterator = this.__iterator(ITERATE_VALUES, reverse);
          var step;
          var iterations = 0;
          while (!(step = iterator.next()).done) {
            if (fn(step.value, iterations++, this) === false) {
              break;
            }
          }
          return iterations;
        };
        zipSequence.__iteratorUncached = function(type, reverse) {
          var iterators = iters.map(
            function(i) {
              return i = Iterable(i), getIterator(reverse ? i.reverse() : i);
            }
          );
          var iterations = 0;
          var isDone = false;
          return new Iterator(function() {
            var steps;
            if (!isDone) {
              steps = iterators.map(function(i) {
                return i.next();
              });
              isDone = steps.some(function(s) {
                return s.done;
              });
            }
            if (isDone) {
              return iteratorDone();
            }
            return iteratorValue(
              type,
              iterations++,
              zipper.apply(null, steps.map(function(s) {
                return s.value;
              }))
            );
          });
        };
        return zipSequence;
      }
      function reify(iter, seq) {
        return isSeq(iter) ? seq : iter.constructor(seq);
      }
      function validateEntry(entry) {
        if (entry !== Object(entry)) {
          throw new TypeError("Expected [K, V] tuple: " + entry);
        }
      }
      function resolveSize(iter) {
        assertNotInfinite(iter.size);
        return ensureSize(iter);
      }
      function iterableClass(iterable) {
        return isKeyed(iterable) ? KeyedIterable : isIndexed(iterable) ? IndexedIterable : SetIterable;
      }
      function makeSequence(iterable) {
        return Object.create(
          (isKeyed(iterable) ? KeyedSeq : isIndexed(iterable) ? IndexedSeq : SetSeq).prototype
        );
      }
      function cacheResultThrough() {
        if (this._iter.cacheResult) {
          this._iter.cacheResult();
          this.size = this._iter.size;
          return this;
        } else {
          return Seq.prototype.cacheResult.call(this);
        }
      }
      function defaultComparator(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      }
      function forceIterator(keyPath) {
        var iter = getIterator(keyPath);
        if (!iter) {
          if (!isArrayLike(keyPath)) {
            throw new TypeError("Expected iterable or array-like: " + keyPath);
          }
          iter = getIterator(Iterable(keyPath));
        }
        return iter;
      }
      createClass(Record3, KeyedCollection);
      function Record3(defaultValues, name) {
        var hasInitialized;
        var RecordType = function Record4(values) {
          if (values instanceof RecordType) {
            return values;
          }
          if (!(this instanceof RecordType)) {
            return new RecordType(values);
          }
          if (!hasInitialized) {
            hasInitialized = true;
            var keys = Object.keys(defaultValues);
            setProps(RecordTypePrototype, keys);
            RecordTypePrototype.size = keys.length;
            RecordTypePrototype._name = name;
            RecordTypePrototype._keys = keys;
            RecordTypePrototype._defaultValues = defaultValues;
          }
          this._map = Map4(values);
        };
        var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
        RecordTypePrototype.constructor = RecordType;
        return RecordType;
      }
      Record3.prototype.toString = function() {
        return this.__toString(recordName(this) + " {", "}");
      };
      Record3.prototype.has = function(k) {
        return this._defaultValues.hasOwnProperty(k);
      };
      Record3.prototype.get = function(k, notSetValue) {
        if (!this.has(k)) {
          return notSetValue;
        }
        var defaultVal = this._defaultValues[k];
        return this._map ? this._map.get(k, defaultVal) : defaultVal;
      };
      Record3.prototype.clear = function() {
        if (this.__ownerID) {
          this._map && this._map.clear();
          return this;
        }
        var RecordType = this.constructor;
        return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
      };
      Record3.prototype.set = function(k, v) {
        if (!this.has(k)) {
          throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
        }
        if (this._map && !this._map.has(k)) {
          var defaultVal = this._defaultValues[k];
          if (v === defaultVal) {
            return this;
          }
        }
        var newMap = this._map && this._map.set(k, v);
        if (this.__ownerID || newMap === this._map) {
          return this;
        }
        return makeRecord(this, newMap);
      };
      Record3.prototype.remove = function(k) {
        if (!this.has(k)) {
          return this;
        }
        var newMap = this._map && this._map.remove(k);
        if (this.__ownerID || newMap === this._map) {
          return this;
        }
        return makeRecord(this, newMap);
      };
      Record3.prototype.wasAltered = function() {
        return this._map.wasAltered();
      };
      Record3.prototype.__iterator = function(type, reverse) {
        var this$0 = this;
        return KeyedIterable(this._defaultValues).map(function(_, k) {
          return this$0.get(k);
        }).__iterator(type, reverse);
      };
      Record3.prototype.__iterate = function(fn, reverse) {
        var this$0 = this;
        return KeyedIterable(this._defaultValues).map(function(_, k) {
          return this$0.get(k);
        }).__iterate(fn, reverse);
      };
      Record3.prototype.__ensureOwner = function(ownerID) {
        if (ownerID === this.__ownerID) {
          return this;
        }
        var newMap = this._map && this._map.__ensureOwner(ownerID);
        if (!ownerID) {
          this.__ownerID = ownerID;
          this._map = newMap;
          return this;
        }
        return makeRecord(this, newMap, ownerID);
      };
      var RecordPrototype = Record3.prototype;
      RecordPrototype[DELETE] = RecordPrototype.remove;
      RecordPrototype.deleteIn = RecordPrototype.removeIn = MapPrototype.removeIn;
      RecordPrototype.merge = MapPrototype.merge;
      RecordPrototype.mergeWith = MapPrototype.mergeWith;
      RecordPrototype.mergeIn = MapPrototype.mergeIn;
      RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
      RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
      RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
      RecordPrototype.setIn = MapPrototype.setIn;
      RecordPrototype.update = MapPrototype.update;
      RecordPrototype.updateIn = MapPrototype.updateIn;
      RecordPrototype.withMutations = MapPrototype.withMutations;
      RecordPrototype.asMutable = MapPrototype.asMutable;
      RecordPrototype.asImmutable = MapPrototype.asImmutable;
      function makeRecord(likeRecord, map, ownerID) {
        var record = Object.create(Object.getPrototypeOf(likeRecord));
        record._map = map;
        record.__ownerID = ownerID;
        return record;
      }
      function recordName(record) {
        return record._name || record.constructor.name || "Record";
      }
      function setProps(prototype, names) {
        try {
          names.forEach(setProp.bind(void 0, prototype));
        } catch (error) {
        }
      }
      function setProp(prototype, name) {
        Object.defineProperty(prototype, name, {
          get: function() {
            return this.get(name);
          },
          set: function(value) {
            invariant(this.__ownerID, "Cannot set on an immutable record.");
            this.set(name, value);
          }
        });
      }
      createClass(Set2, SetCollection);
      function Set2(value) {
        return value === null || value === void 0 ? emptySet() : isSet(value) && !isOrdered(value) ? value : emptySet().withMutations(function(set) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v) {
            return set.add(v);
          });
        });
      }
      Set2.of = function() {
        return this(arguments);
      };
      Set2.fromKeys = function(value) {
        return this(KeyedIterable(value).keySeq());
      };
      Set2.prototype.toString = function() {
        return this.__toString("Set {", "}");
      };
      Set2.prototype.has = function(value) {
        return this._map.has(value);
      };
      Set2.prototype.add = function(value) {
        return updateSet(this, this._map.set(value, true));
      };
      Set2.prototype.remove = function(value) {
        return updateSet(this, this._map.remove(value));
      };
      Set2.prototype.clear = function() {
        return updateSet(this, this._map.clear());
      };
      Set2.prototype.union = function() {
        var iters = SLICE$0.call(arguments, 0);
        iters = iters.filter(function(x) {
          return x.size !== 0;
        });
        if (iters.length === 0) {
          return this;
        }
        if (this.size === 0 && !this.__ownerID && iters.length === 1) {
          return this.constructor(iters[0]);
        }
        return this.withMutations(function(set) {
          for (var ii = 0; ii < iters.length; ii++) {
            SetIterable(iters[ii]).forEach(function(value) {
              return set.add(value);
            });
          }
        });
      };
      Set2.prototype.intersect = function() {
        var iters = SLICE$0.call(arguments, 0);
        if (iters.length === 0) {
          return this;
        }
        iters = iters.map(function(iter) {
          return SetIterable(iter);
        });
        var originalSet = this;
        return this.withMutations(function(set) {
          originalSet.forEach(function(value) {
            if (!iters.every(function(iter) {
              return iter.includes(value);
            })) {
              set.remove(value);
            }
          });
        });
      };
      Set2.prototype.subtract = function() {
        var iters = SLICE$0.call(arguments, 0);
        if (iters.length === 0) {
          return this;
        }
        iters = iters.map(function(iter) {
          return SetIterable(iter);
        });
        var originalSet = this;
        return this.withMutations(function(set) {
          originalSet.forEach(function(value) {
            if (iters.some(function(iter) {
              return iter.includes(value);
            })) {
              set.remove(value);
            }
          });
        });
      };
      Set2.prototype.merge = function() {
        return this.union.apply(this, arguments);
      };
      Set2.prototype.mergeWith = function(merger) {
        var iters = SLICE$0.call(arguments, 1);
        return this.union.apply(this, iters);
      };
      Set2.prototype.sort = function(comparator) {
        return OrderedSet2(sortFactory(this, comparator));
      };
      Set2.prototype.sortBy = function(mapper, comparator) {
        return OrderedSet2(sortFactory(this, comparator, mapper));
      };
      Set2.prototype.wasAltered = function() {
        return this._map.wasAltered();
      };
      Set2.prototype.__iterate = function(fn, reverse) {
        var this$0 = this;
        return this._map.__iterate(function(_, k) {
          return fn(k, k, this$0);
        }, reverse);
      };
      Set2.prototype.__iterator = function(type, reverse) {
        return this._map.map(function(_, k) {
          return k;
        }).__iterator(type, reverse);
      };
      Set2.prototype.__ensureOwner = function(ownerID) {
        if (ownerID === this.__ownerID) {
          return this;
        }
        var newMap = this._map.__ensureOwner(ownerID);
        if (!ownerID) {
          this.__ownerID = ownerID;
          this._map = newMap;
          return this;
        }
        return this.__make(newMap, ownerID);
      };
      function isSet(maybeSet) {
        return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
      }
      Set2.isSet = isSet;
      var IS_SET_SENTINEL = "@@__IMMUTABLE_SET__@@";
      var SetPrototype = Set2.prototype;
      SetPrototype[IS_SET_SENTINEL] = true;
      SetPrototype[DELETE] = SetPrototype.remove;
      SetPrototype.mergeDeep = SetPrototype.merge;
      SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
      SetPrototype.withMutations = MapPrototype.withMutations;
      SetPrototype.asMutable = MapPrototype.asMutable;
      SetPrototype.asImmutable = MapPrototype.asImmutable;
      SetPrototype.__empty = emptySet;
      SetPrototype.__make = makeSet;
      function updateSet(set, newMap) {
        if (set.__ownerID) {
          set.size = newMap.size;
          set._map = newMap;
          return set;
        }
        return newMap === set._map ? set : newMap.size === 0 ? set.__empty() : set.__make(newMap);
      }
      function makeSet(map, ownerID) {
        var set = Object.create(SetPrototype);
        set.size = map ? map.size : 0;
        set._map = map;
        set.__ownerID = ownerID;
        return set;
      }
      var EMPTY_SET;
      function emptySet() {
        return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
      }
      createClass(OrderedSet2, Set2);
      function OrderedSet2(value) {
        return value === null || value === void 0 ? emptyOrderedSet() : isOrderedSet(value) ? value : emptyOrderedSet().withMutations(function(set) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v) {
            return set.add(v);
          });
        });
      }
      OrderedSet2.of = function() {
        return this(arguments);
      };
      OrderedSet2.fromKeys = function(value) {
        return this(KeyedIterable(value).keySeq());
      };
      OrderedSet2.prototype.toString = function() {
        return this.__toString("OrderedSet {", "}");
      };
      function isOrderedSet(maybeOrderedSet) {
        return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
      }
      OrderedSet2.isOrderedSet = isOrderedSet;
      var OrderedSetPrototype = OrderedSet2.prototype;
      OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
      OrderedSetPrototype.__empty = emptyOrderedSet;
      OrderedSetPrototype.__make = makeOrderedSet;
      function makeOrderedSet(map, ownerID) {
        var set = Object.create(OrderedSetPrototype);
        set.size = map ? map.size : 0;
        set._map = map;
        set.__ownerID = ownerID;
        return set;
      }
      var EMPTY_ORDERED_SET;
      function emptyOrderedSet() {
        return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
      }
      createClass(Stack, IndexedCollection);
      function Stack(value) {
        return value === null || value === void 0 ? emptyStack() : isStack(value) ? value : emptyStack().unshiftAll(value);
      }
      Stack.of = function() {
        return this(arguments);
      };
      Stack.prototype.toString = function() {
        return this.__toString("Stack [", "]");
      };
      Stack.prototype.get = function(index, notSetValue) {
        var head = this._head;
        index = wrapIndex(this, index);
        while (head && index--) {
          head = head.next;
        }
        return head ? head.value : notSetValue;
      };
      Stack.prototype.peek = function() {
        return this._head && this._head.value;
      };
      Stack.prototype.push = function() {
        if (arguments.length === 0) {
          return this;
        }
        var newSize = this.size + arguments.length;
        var head = this._head;
        for (var ii = arguments.length - 1; ii >= 0; ii--) {
          head = {
            value: arguments[ii],
            next: head
          };
        }
        if (this.__ownerID) {
          this.size = newSize;
          this._head = head;
          this.__hash = void 0;
          this.__altered = true;
          return this;
        }
        return makeStack(newSize, head);
      };
      Stack.prototype.pushAll = function(iter) {
        iter = IndexedIterable(iter);
        if (iter.size === 0) {
          return this;
        }
        assertNotInfinite(iter.size);
        var newSize = this.size;
        var head = this._head;
        iter.reverse().forEach(function(value) {
          newSize++;
          head = {
            value,
            next: head
          };
        });
        if (this.__ownerID) {
          this.size = newSize;
          this._head = head;
          this.__hash = void 0;
          this.__altered = true;
          return this;
        }
        return makeStack(newSize, head);
      };
      Stack.prototype.pop = function() {
        return this.slice(1);
      };
      Stack.prototype.unshift = function() {
        return this.push.apply(this, arguments);
      };
      Stack.prototype.unshiftAll = function(iter) {
        return this.pushAll(iter);
      };
      Stack.prototype.shift = function() {
        return this.pop.apply(this, arguments);
      };
      Stack.prototype.clear = function() {
        if (this.size === 0) {
          return this;
        }
        if (this.__ownerID) {
          this.size = 0;
          this._head = void 0;
          this.__hash = void 0;
          this.__altered = true;
          return this;
        }
        return emptyStack();
      };
      Stack.prototype.slice = function(begin, end) {
        if (wholeSlice(begin, end, this.size)) {
          return this;
        }
        var resolvedBegin = resolveBegin(begin, this.size);
        var resolvedEnd = resolveEnd(end, this.size);
        if (resolvedEnd !== this.size) {
          return IndexedCollection.prototype.slice.call(this, begin, end);
        }
        var newSize = this.size - resolvedBegin;
        var head = this._head;
        while (resolvedBegin--) {
          head = head.next;
        }
        if (this.__ownerID) {
          this.size = newSize;
          this._head = head;
          this.__hash = void 0;
          this.__altered = true;
          return this;
        }
        return makeStack(newSize, head);
      };
      Stack.prototype.__ensureOwner = function(ownerID) {
        if (ownerID === this.__ownerID) {
          return this;
        }
        if (!ownerID) {
          this.__ownerID = ownerID;
          this.__altered = false;
          return this;
        }
        return makeStack(this.size, this._head, ownerID, this.__hash);
      };
      Stack.prototype.__iterate = function(fn, reverse) {
        if (reverse) {
          return this.reverse().__iterate(fn);
        }
        var iterations = 0;
        var node = this._head;
        while (node) {
          if (fn(node.value, iterations++, this) === false) {
            break;
          }
          node = node.next;
        }
        return iterations;
      };
      Stack.prototype.__iterator = function(type, reverse) {
        if (reverse) {
          return this.reverse().__iterator(type);
        }
        var iterations = 0;
        var node = this._head;
        return new Iterator(function() {
          if (node) {
            var value = node.value;
            node = node.next;
            return iteratorValue(type, iterations++, value);
          }
          return iteratorDone();
        });
      };
      function isStack(maybeStack) {
        return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
      }
      Stack.isStack = isStack;
      var IS_STACK_SENTINEL = "@@__IMMUTABLE_STACK__@@";
      var StackPrototype = Stack.prototype;
      StackPrototype[IS_STACK_SENTINEL] = true;
      StackPrototype.withMutations = MapPrototype.withMutations;
      StackPrototype.asMutable = MapPrototype.asMutable;
      StackPrototype.asImmutable = MapPrototype.asImmutable;
      StackPrototype.wasAltered = MapPrototype.wasAltered;
      function makeStack(size, head, ownerID, hash2) {
        var map = Object.create(StackPrototype);
        map.size = size;
        map._head = head;
        map.__ownerID = ownerID;
        map.__hash = hash2;
        map.__altered = false;
        return map;
      }
      var EMPTY_STACK;
      function emptyStack() {
        return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
      }
      function mixin(ctor, methods) {
        var keyCopier = function(key) {
          ctor.prototype[key] = methods[key];
        };
        Object.keys(methods).forEach(keyCopier);
        Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);
        return ctor;
      }
      Iterable.Iterator = Iterator;
      mixin(Iterable, {
        toArray: function() {
          assertNotInfinite(this.size);
          var array = new Array(this.size || 0);
          this.valueSeq().__iterate(function(v, i) {
            array[i] = v;
          });
          return array;
        },
        toIndexedSeq: function() {
          return new ToIndexedSequence(this);
        },
        toJS: function() {
          return this.toSeq().map(
            function(value) {
              return value && typeof value.toJS === "function" ? value.toJS() : value;
            }
          ).__toJS();
        },
        toJSON: function() {
          return this.toSeq().map(
            function(value) {
              return value && typeof value.toJSON === "function" ? value.toJSON() : value;
            }
          ).__toJS();
        },
        toKeyedSeq: function() {
          return new ToKeyedSequence(this, true);
        },
        toMap: function() {
          return Map4(this.toKeyedSeq());
        },
        toObject: function() {
          assertNotInfinite(this.size);
          var object = {};
          this.__iterate(function(v, k) {
            object[k] = v;
          });
          return object;
        },
        toOrderedMap: function() {
          return OrderedMap(this.toKeyedSeq());
        },
        toOrderedSet: function() {
          return OrderedSet2(isKeyed(this) ? this.valueSeq() : this);
        },
        toSet: function() {
          return Set2(isKeyed(this) ? this.valueSeq() : this);
        },
        toSetSeq: function() {
          return new ToSetSequence(this);
        },
        toSeq: function() {
          return isIndexed(this) ? this.toIndexedSeq() : isKeyed(this) ? this.toKeyedSeq() : this.toSetSeq();
        },
        toStack: function() {
          return Stack(isKeyed(this) ? this.valueSeq() : this);
        },
        toList: function() {
          return List2(isKeyed(this) ? this.valueSeq() : this);
        },
        toString: function() {
          return "[Iterable]";
        },
        __toString: function(head, tail) {
          if (this.size === 0) {
            return head + tail;
          }
          return head + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + tail;
        },
        concat: function() {
          var values = SLICE$0.call(arguments, 0);
          return reify(this, concatFactory(this, values));
        },
        includes: function(searchValue) {
          return this.some(function(value) {
            return is(value, searchValue);
          });
        },
        entries: function() {
          return this.__iterator(ITERATE_ENTRIES);
        },
        every: function(predicate, context) {
          assertNotInfinite(this.size);
          var returnValue = true;
          this.__iterate(function(v, k, c) {
            if (!predicate.call(context, v, k, c)) {
              returnValue = false;
              return false;
            }
          });
          return returnValue;
        },
        filter: function(predicate, context) {
          return reify(this, filterFactory(this, predicate, context, true));
        },
        find: function(predicate, context, notSetValue) {
          var entry = this.findEntry(predicate, context);
          return entry ? entry[1] : notSetValue;
        },
        forEach: function(sideEffect, context) {
          assertNotInfinite(this.size);
          return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
        },
        join: function(separator) {
          assertNotInfinite(this.size);
          separator = separator !== void 0 ? "" + separator : ",";
          var joined = "";
          var isFirst = true;
          this.__iterate(function(v) {
            isFirst ? isFirst = false : joined += separator;
            joined += v !== null && v !== void 0 ? v.toString() : "";
          });
          return joined;
        },
        keys: function() {
          return this.__iterator(ITERATE_KEYS);
        },
        map: function(mapper, context) {
          return reify(this, mapFactory(this, mapper, context));
        },
        reduce: function(reducer, initialReduction, context) {
          assertNotInfinite(this.size);
          var reduction;
          var useFirst;
          if (arguments.length < 2) {
            useFirst = true;
          } else {
            reduction = initialReduction;
          }
          this.__iterate(function(v, k, c) {
            if (useFirst) {
              useFirst = false;
              reduction = v;
            } else {
              reduction = reducer.call(context, reduction, v, k, c);
            }
          });
          return reduction;
        },
        reduceRight: function(reducer, initialReduction, context) {
          var reversed = this.toKeyedSeq().reverse();
          return reversed.reduce.apply(reversed, arguments);
        },
        reverse: function() {
          return reify(this, reverseFactory(this, true));
        },
        slice: function(begin, end) {
          return reify(this, sliceFactory(this, begin, end, true));
        },
        some: function(predicate, context) {
          return !this.every(not(predicate), context);
        },
        sort: function(comparator) {
          return reify(this, sortFactory(this, comparator));
        },
        values: function() {
          return this.__iterator(ITERATE_VALUES);
        },
        butLast: function() {
          return this.slice(0, -1);
        },
        isEmpty: function() {
          return this.size !== void 0 ? this.size === 0 : !this.some(function() {
            return true;
          });
        },
        count: function(predicate, context) {
          return ensureSize(
            predicate ? this.toSeq().filter(predicate, context) : this
          );
        },
        countBy: function(grouper, context) {
          return countByFactory(this, grouper, context);
        },
        equals: function(other) {
          return deepEqual(this, other);
        },
        entrySeq: function() {
          var iterable = this;
          if (iterable._cache) {
            return new ArraySeq(iterable._cache);
          }
          var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
          entriesSequence.fromEntrySeq = function() {
            return iterable.toSeq();
          };
          return entriesSequence;
        },
        filterNot: function(predicate, context) {
          return this.filter(not(predicate), context);
        },
        findEntry: function(predicate, context, notSetValue) {
          var found = notSetValue;
          this.__iterate(function(v, k, c) {
            if (predicate.call(context, v, k, c)) {
              found = [k, v];
              return false;
            }
          });
          return found;
        },
        findKey: function(predicate, context) {
          var entry = this.findEntry(predicate, context);
          return entry && entry[0];
        },
        findLast: function(predicate, context, notSetValue) {
          return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
        },
        findLastEntry: function(predicate, context, notSetValue) {
          return this.toKeyedSeq().reverse().findEntry(predicate, context, notSetValue);
        },
        findLastKey: function(predicate, context) {
          return this.toKeyedSeq().reverse().findKey(predicate, context);
        },
        first: function() {
          return this.find(returnTrue);
        },
        flatMap: function(mapper, context) {
          return reify(this, flatMapFactory(this, mapper, context));
        },
        flatten: function(depth) {
          return reify(this, flattenFactory(this, depth, true));
        },
        fromEntrySeq: function() {
          return new FromEntriesSequence(this);
        },
        get: function(searchKey, notSetValue) {
          return this.find(function(_, key) {
            return is(key, searchKey);
          }, void 0, notSetValue);
        },
        getIn: function(searchKeyPath, notSetValue) {
          var nested = this;
          var iter = forceIterator(searchKeyPath);
          var step;
          while (!(step = iter.next()).done) {
            var key = step.value;
            nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
            if (nested === NOT_SET) {
              return notSetValue;
            }
          }
          return nested;
        },
        groupBy: function(grouper, context) {
          return groupByFactory(this, grouper, context);
        },
        has: function(searchKey) {
          return this.get(searchKey, NOT_SET) !== NOT_SET;
        },
        hasIn: function(searchKeyPath) {
          return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
        },
        isSubset: function(iter) {
          iter = typeof iter.includes === "function" ? iter : Iterable(iter);
          return this.every(function(value) {
            return iter.includes(value);
          });
        },
        isSuperset: function(iter) {
          iter = typeof iter.isSubset === "function" ? iter : Iterable(iter);
          return iter.isSubset(this);
        },
        keyOf: function(searchValue) {
          return this.findKey(function(value) {
            return is(value, searchValue);
          });
        },
        keySeq: function() {
          return this.toSeq().map(keyMapper).toIndexedSeq();
        },
        last: function() {
          return this.toSeq().reverse().first();
        },
        lastKeyOf: function(searchValue) {
          return this.toKeyedSeq().reverse().keyOf(searchValue);
        },
        max: function(comparator) {
          return maxFactory(this, comparator);
        },
        maxBy: function(mapper, comparator) {
          return maxFactory(this, comparator, mapper);
        },
        min: function(comparator) {
          return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
        },
        minBy: function(mapper, comparator) {
          return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
        },
        rest: function() {
          return this.slice(1);
        },
        skip: function(amount) {
          return this.slice(Math.max(0, amount));
        },
        skipLast: function(amount) {
          return reify(this, this.toSeq().reverse().skip(amount).reverse());
        },
        skipWhile: function(predicate, context) {
          return reify(this, skipWhileFactory(this, predicate, context, true));
        },
        skipUntil: function(predicate, context) {
          return this.skipWhile(not(predicate), context);
        },
        sortBy: function(mapper, comparator) {
          return reify(this, sortFactory(this, comparator, mapper));
        },
        take: function(amount) {
          return this.slice(0, Math.max(0, amount));
        },
        takeLast: function(amount) {
          return reify(this, this.toSeq().reverse().take(amount).reverse());
        },
        takeWhile: function(predicate, context) {
          return reify(this, takeWhileFactory(this, predicate, context));
        },
        takeUntil: function(predicate, context) {
          return this.takeWhile(not(predicate), context);
        },
        valueSeq: function() {
          return this.toIndexedSeq();
        },
        hashCode: function() {
          return this.__hash || (this.__hash = hashIterable(this));
        }
      });
      var IterablePrototype = Iterable.prototype;
      IterablePrototype[IS_ITERABLE_SENTINEL] = true;
      IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
      IterablePrototype.__toJS = IterablePrototype.toArray;
      IterablePrototype.__toStringMapper = quoteString;
      IterablePrototype.inspect = IterablePrototype.toSource = function() {
        return this.toString();
      };
      IterablePrototype.chain = IterablePrototype.flatMap;
      IterablePrototype.contains = IterablePrototype.includes;
      mixin(KeyedIterable, {
        flip: function() {
          return reify(this, flipFactory(this));
        },
        mapEntries: function(mapper, context) {
          var this$0 = this;
          var iterations = 0;
          return reify(
            this,
            this.toSeq().map(
              function(v, k) {
                return mapper.call(context, [k, v], iterations++, this$0);
              }
            ).fromEntrySeq()
          );
        },
        mapKeys: function(mapper, context) {
          var this$0 = this;
          return reify(
            this,
            this.toSeq().flip().map(
              function(k, v) {
                return mapper.call(context, k, v, this$0);
              }
            ).flip()
          );
        }
      });
      var KeyedIterablePrototype = KeyedIterable.prototype;
      KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
      KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
      KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
      KeyedIterablePrototype.__toStringMapper = function(v, k) {
        return JSON.stringify(k) + ": " + quoteString(v);
      };
      mixin(IndexedIterable, {
        toKeyedSeq: function() {
          return new ToKeyedSequence(this, false);
        },
        filter: function(predicate, context) {
          return reify(this, filterFactory(this, predicate, context, false));
        },
        findIndex: function(predicate, context) {
          var entry = this.findEntry(predicate, context);
          return entry ? entry[0] : -1;
        },
        indexOf: function(searchValue) {
          var key = this.keyOf(searchValue);
          return key === void 0 ? -1 : key;
        },
        lastIndexOf: function(searchValue) {
          var key = this.lastKeyOf(searchValue);
          return key === void 0 ? -1 : key;
        },
        reverse: function() {
          return reify(this, reverseFactory(this, false));
        },
        slice: function(begin, end) {
          return reify(this, sliceFactory(this, begin, end, false));
        },
        splice: function(index, removeNum) {
          var numArgs = arguments.length;
          removeNum = Math.max(removeNum | 0, 0);
          if (numArgs === 0 || numArgs === 2 && !removeNum) {
            return this;
          }
          index = resolveBegin(index, index < 0 ? this.count() : this.size);
          var spliced = this.slice(0, index);
          return reify(
            this,
            numArgs === 1 ? spliced : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
          );
        },
        findLastIndex: function(predicate, context) {
          var entry = this.findLastEntry(predicate, context);
          return entry ? entry[0] : -1;
        },
        first: function() {
          return this.get(0);
        },
        flatten: function(depth) {
          return reify(this, flattenFactory(this, depth, false));
        },
        get: function(index, notSetValue) {
          index = wrapIndex(this, index);
          return index < 0 || (this.size === Infinity || this.size !== void 0 && index > this.size) ? notSetValue : this.find(function(_, key) {
            return key === index;
          }, void 0, notSetValue);
        },
        has: function(index) {
          index = wrapIndex(this, index);
          return index >= 0 && (this.size !== void 0 ? this.size === Infinity || index < this.size : this.indexOf(index) !== -1);
        },
        interpose: function(separator) {
          return reify(this, interposeFactory(this, separator));
        },
        interleave: function() {
          var iterables = [this].concat(arrCopy(arguments));
          var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
          var interleaved = zipped.flatten(true);
          if (zipped.size) {
            interleaved.size = zipped.size * iterables.length;
          }
          return reify(this, interleaved);
        },
        keySeq: function() {
          return Range(0, this.size);
        },
        last: function() {
          return this.get(-1);
        },
        skipWhile: function(predicate, context) {
          return reify(this, skipWhileFactory(this, predicate, context, false));
        },
        zip: function() {
          var iterables = [this].concat(arrCopy(arguments));
          return reify(this, zipWithFactory(this, defaultZipper, iterables));
        },
        zipWith: function(zipper) {
          var iterables = arrCopy(arguments);
          iterables[0] = this;
          return reify(this, zipWithFactory(this, zipper, iterables));
        }
      });
      IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
      IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;
      mixin(SetIterable, {
        get: function(value, notSetValue) {
          return this.has(value) ? value : notSetValue;
        },
        includes: function(value) {
          return this.has(value);
        },
        keySeq: function() {
          return this.valueSeq();
        }
      });
      SetIterable.prototype.has = IterablePrototype.includes;
      SetIterable.prototype.contains = SetIterable.prototype.includes;
      mixin(KeyedSeq, KeyedIterable.prototype);
      mixin(IndexedSeq, IndexedIterable.prototype);
      mixin(SetSeq, SetIterable.prototype);
      mixin(KeyedCollection, KeyedIterable.prototype);
      mixin(IndexedCollection, IndexedIterable.prototype);
      mixin(SetCollection, SetIterable.prototype);
      function keyMapper(v, k) {
        return k;
      }
      function entryMapper(v, k) {
        return [k, v];
      }
      function not(predicate) {
        return function() {
          return !predicate.apply(this, arguments);
        };
      }
      function neg(predicate) {
        return function() {
          return -predicate.apply(this, arguments);
        };
      }
      function quoteString(value) {
        return typeof value === "string" ? JSON.stringify(value) : String(value);
      }
      function defaultZipper() {
        return arrCopy(arguments);
      }
      function defaultNegComparator(a, b) {
        return a < b ? 1 : a > b ? -1 : 0;
      }
      function hashIterable(iterable) {
        if (iterable.size === Infinity) {
          return 0;
        }
        var ordered = isOrdered(iterable);
        var keyed = isKeyed(iterable);
        var h = ordered ? 1 : 0;
        var size = iterable.__iterate(
          keyed ? ordered ? function(v, k) {
            h = 31 * h + hashMerge(hash(v), hash(k)) | 0;
          } : function(v, k) {
            h = h + hashMerge(hash(v), hash(k)) | 0;
          } : ordered ? function(v) {
            h = 31 * h + hash(v) | 0;
          } : function(v) {
            h = h + hash(v) | 0;
          }
        );
        return murmurHashOfSize(size, h);
      }
      function murmurHashOfSize(size, h) {
        h = imul(h, 3432918353);
        h = imul(h << 15 | h >>> -15, 461845907);
        h = imul(h << 13 | h >>> -13, 5);
        h = (h + 3864292196 | 0) ^ size;
        h = imul(h ^ h >>> 16, 2246822507);
        h = imul(h ^ h >>> 13, 3266489909);
        h = smi(h ^ h >>> 16);
        return h;
      }
      function hashMerge(a, b) {
        return a ^ b + 2654435769 + (a << 6) + (a >> 2) | 0;
      }
      var Immutable6 = {
        Iterable,
        Seq,
        Collection,
        Map: Map4,
        OrderedMap,
        List: List2,
        Stack,
        Set: Set2,
        OrderedSet: OrderedSet2,
        Record: Record3,
        Range,
        Repeat,
        is,
        fromJS
      };
      return Immutable6;
    });
  }
});

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports) {
    exports.isString = function(val) {
      return typeof val === "string" || objectToString(val) === "[object String]";
    };
    exports.isArray = Array.isArray || function(val) {
      return objectToString(val) === "[object Array]";
    };
    if (typeof /./ !== "function" && typeof Int8Array !== "object") {
      exports.isFunction = function(obj) {
        return typeof obj === "function" || false;
      };
    } else {
      exports.isFunction = function(val) {
        return toString.call(val) === "[object Function]";
      };
    }
    exports.isObject = function(obj) {
      var type = typeof obj;
      return type === "function" || type === "object" && !!obj;
    };
    exports.extend = function(obj) {
      var length = arguments.length;
      if (!obj || length < 2) {
        return obj || {};
      }
      for (var index = 1; index < length; index++) {
        var source = arguments[index];
        var keys = Object.keys(source);
        var l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          obj[key] = source[key];
        }
      }
      return obj;
    };
    exports.clone = function(obj) {
      if (!exports.isObject(obj)) {
        return obj;
      }
      return exports.isArray(obj) ? obj.slice() : exports.extend({}, obj);
    };
    exports.each = function(collection, iteratee, context) {
      var length = collection ? collection.length : 0;
      var i = -1;
      var keys;
      var origIteratee;
      if (context) {
        origIteratee = iteratee;
        iteratee = function(value, index, innerCollection) {
          return origIteratee.call(context, value, index, innerCollection);
        };
      }
      if (isLength(length)) {
        while (++i < length) {
          if (iteratee(collection[i], i, collection) === false) {
            break;
          }
        }
      } else {
        keys = Object.keys(collection);
        length = keys.length;
        while (++i < length) {
          if (iteratee(collection[keys[i]], keys[i], collection) === false) {
            break;
          }
        }
      }
      return collection;
    };
    exports.partial = function(func) {
      var slice = Array.prototype.slice;
      var partialArgs = slice.call(arguments, 1);
      return function() {
        return func.apply(this, partialArgs.concat(slice.call(arguments)));
      };
    };
    exports.toFactory = function(Klass) {
      var Factory = function(...args) {
        return new Klass(...args);
      };
      Factory.__proto__ = Klass;
      Factory.prototype = Klass.prototype;
      return Factory;
    };
    function objectToString(obj) {
      return obj && typeof obj === "object" && toString.call(obj);
    }
    function isLength(val) {
      return typeof val === "number" && val > -1 && val % 1 === 0 && val <= Number.MAX_VALUE;
    }
  }
});

// src/console-polyfill.js
try {
  if (!(window.console && console.log)) {
    console = {
      log: function() {
      },
      debug: function() {
      },
      info: function() {
      },
      warn: function() {
      },
      error: function() {
      }
    };
  }
} catch (e) {
}

// src/store.js
var import_immutable2 = __toESM(require_immutable());
var import_utils2 = __toESM(require_utils());

// src/immutable-helpers.js
var import_immutable = __toESM(require_immutable());
var import_utils = __toESM(require_utils());
function isImmutable(obj) {
  return import_immutable.default.Iterable.isIterable(obj);
}
function isImmutableValue(obj) {
  return isImmutable(obj) || !(0, import_utils.isObject)(obj);
}
function toJS(arg) {
  return isImmutable(arg) ? arg.toJS() : arg;
}
function toImmutable(arg) {
  return isImmutable(arg) ? arg : import_immutable.default.fromJS(arg);
}

// src/store.js
var Store = class {
  constructor(config) {
    this.__handlers = (0, import_immutable2.Map)({});
    if (config) {
      (0, import_utils2.extend)(this, config);
    }
    this.initialize();
  }
  initialize() {
  }
  getInitialState() {
    return (0, import_immutable2.Map)();
  }
  handle(state, type, payload) {
    const handler = this.__handlers.get(type);
    if (typeof handler === "function") {
      return handler.call(this, state, payload, type);
    }
    return state;
  }
  handleReset(state) {
    return this.getInitialState();
  }
  on(actionType, handler) {
    this.__handlers = this.__handlers.set(actionType, handler);
  }
  serialize(state) {
    return toJS(state);
  }
  deserialize(state) {
    return toImmutable(state);
  }
};
var store_default = (0, import_utils2.toFactory)(Store);

// src/reactor.js
var import_immutable8 = __toESM(require_immutable());

// src/create-react-mixin.js
var import_utils3 = __toESM(require_utils());
function getState(reactor, data) {
  let state = {};
  (0, import_utils3.each)(data, (value, key) => {
    state[key] = reactor.evaluate(value);
  });
  return state;
}
function create_react_mixin_default(reactor) {
  return {
    getInitialState() {
      return getState(reactor, this.getDataBindings());
    },
    componentDidMount() {
      this.__unwatchFns = [];
      (0, import_utils3.each)(this.getDataBindings(), (getter, key) => {
        const unwatchFn = reactor.observe(getter, (val) => {
          this.setState({
            [key]: val
          });
        });
        this.__unwatchFns.push(unwatchFn);
      });
    },
    componentWillUnmount() {
      while (this.__unwatchFns.length) {
        this.__unwatchFns.shift()();
      }
    }
  };
}

// src/reactor/fns.js
var import_immutable6 = __toESM(require_immutable());

// src/reactor/cache.js
var import_immutable3 = __toESM(require_immutable());
var CacheEntry = (0, import_immutable3.Record)({
  value: null,
  storeStates: (0, import_immutable3.Map)(),
  dispatchId: null
});
var BasicCache = class {
  constructor(cache = (0, import_immutable3.Map)()) {
    this.cache = cache;
  }
  lookup(item, notFoundValue) {
    return this.cache.get(item, notFoundValue);
  }
  has(item) {
    return this.cache.has(item);
  }
  asMap() {
    return this.cache;
  }
  hit(item) {
    return this;
  }
  miss(item, entry) {
    return new BasicCache(
      this.cache.update(item, (existingEntry) => {
        if (existingEntry && existingEntry.dispatchId > entry.dispatchId) {
          throw new Error("Refusing to cache older value");
        }
        return entry;
      })
    );
  }
  evict(item) {
    return new BasicCache(this.cache.remove(item));
  }
};
var DEFAULT_LRU_LIMIT = 1e3;
var DEFAULT_LRU_EVICT_COUNT = 1;
var LRUCache = class {
  constructor(limit = DEFAULT_LRU_LIMIT, evictCount = DEFAULT_LRU_EVICT_COUNT, cache = new BasicCache(), lru = (0, import_immutable3.OrderedSet)()) {
    this.limit = limit;
    this.evictCount = evictCount;
    this.cache = cache;
    this.lru = lru;
  }
  lookup(item, notFoundValue) {
    return this.cache.lookup(item, notFoundValue);
  }
  has(item) {
    return this.cache.has(item);
  }
  asMap() {
    return this.cache.asMap();
  }
  hit(item) {
    if (!this.cache.has(item)) {
      return this;
    }
    return new LRUCache(this.limit, this.evictCount, this.cache, this.lru.remove(item).add(item));
  }
  miss(item, entry) {
    var lruCache;
    if (this.lru.size >= this.limit) {
      if (this.has(item)) {
        return new LRUCache(
          this.limit,
          this.evictCount,
          this.cache.miss(item, entry),
          this.lru.remove(item).add(item)
        );
      }
      const cache = this.lru.take(this.evictCount).reduce((c, evictItem) => c.evict(evictItem), this.cache).miss(item, entry);
      lruCache = new LRUCache(
        this.limit,
        this.evictCount,
        cache,
        this.lru.skip(this.evictCount).add(item)
      );
    } else {
      lruCache = new LRUCache(
        this.limit,
        this.evictCount,
        this.cache.miss(item, entry),
        this.lru.add(item)
      );
    }
    return lruCache;
  }
  evict(item) {
    if (!this.cache.has(item)) {
      return this;
    }
    return new LRUCache(
      this.limit,
      this.evictCount,
      this.cache.evict(item),
      this.lru.remove(item)
    );
  }
};
function DefaultCache() {
  return new BasicCache();
}

// src/getter.js
var import_immutable5 = __toESM(require_immutable());
var import_utils5 = __toESM(require_utils());

// src/key-path.js
var import_immutable4 = __toESM(require_immutable());
var import_utils4 = __toESM(require_utils());
function isKeyPath(toTest) {
  return (0, import_utils4.isArray)(toTest) && !(0, import_utils4.isFunction)(toTest[toTest.length - 1]);
}
function isEqual(a, b) {
  const iA = import_immutable4.default.List(a);
  const iB = import_immutable4.default.List(b);
  return import_immutable4.default.is(iA, iB);
}

// src/getter.js
var identity = (x) => x;
function isGetter(toTest) {
  return (0, import_utils5.isArray)(toTest) && (0, import_utils5.isFunction)(toTest[toTest.length - 1]);
}
function getComputeFn(getter) {
  return getter[getter.length - 1];
}
function getDeps(getter) {
  return getter.slice(0, getter.length - 1);
}
function getFlattenedDeps(getter, existing) {
  if (!existing) {
    existing = import_immutable5.default.Set();
  }
  const toAdd = import_immutable5.default.Set().withMutations((set) => {
    if (!isGetter(getter)) {
      throw new Error("getFlattenedDeps must be passed a Getter");
    }
    getDeps(getter).forEach((dep) => {
      if (isKeyPath(dep)) {
        set.add((0, import_immutable5.List)(dep));
      } else if (isGetter(dep)) {
        set.union(getFlattenedDeps(dep));
      } else {
        throw new Error("Invalid getter, each dependency must be a KeyPath or Getter");
      }
    });
  });
  return existing.union(toAdd);
}
function fromKeyPath(keyPath) {
  if (!isKeyPath(keyPath)) {
    throw new Error("Cannot create Getter from KeyPath: " + keyPath);
  }
  return [keyPath, identity];
}
function getStoreDeps(getter) {
  if (getter.hasOwnProperty("__storeDeps")) {
    return getter.__storeDeps;
  }
  const storeDeps = getFlattenedDeps(getter).map((keyPath) => keyPath.first()).filter((x) => !!x);
  Object.defineProperty(getter, "__storeDeps", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: storeDeps
  });
  return storeDeps;
}

// src/reactor/fns.js
var import_utils6 = __toESM(require_utils());
var EvaluateResult = import_immutable6.default.Record({ result: null, reactorState: null });
function evaluateResult(result, reactorState) {
  return new EvaluateResult({
    result,
    reactorState
  });
}
function registerStores(reactorState, stores) {
  return reactorState.withMutations((reactorState2) => {
    (0, import_utils6.each)(stores, (store, id) => {
      if (reactorState2.getIn(["stores", id])) {
        console.warn("Store already defined for id = " + id);
      }
      const initialState = store.getInitialState();
      if (initialState === void 0 && getOption(reactorState2, "throwOnUndefinedStoreReturnValue")) {
        throw new Error("Store getInitialState() must return a value, did you forget a return statement");
      }
      if (getOption(reactorState2, "throwOnNonImmutableStore") && !isImmutableValue(initialState)) {
        throw new Error("Store getInitialState() must return an immutable value, did you forget to call toImmutable");
      }
      reactorState2.update("stores", (stores2) => stores2.set(id, store)).update("state", (state) => state.set(id, initialState)).update("dirtyStores", (state) => state.add(id)).update("storeStates", (storeStates) => incrementStoreStates(storeStates, [id]));
    });
    incrementId(reactorState2);
  });
}
function replaceStores(reactorState, stores) {
  return reactorState.withMutations((reactorState2) => {
    (0, import_utils6.each)(stores, (store, id) => {
      reactorState2.update("stores", (stores2) => stores2.set(id, store));
    });
  });
}
function dispatch(reactorState, actionType, payload) {
  if (actionType === void 0 && getOption(reactorState, "throwOnUndefinedActionType")) {
    throw new Error("`dispatch` cannot be called with an `undefined` action type.");
  }
  const currState = reactorState.get("state");
  let dirtyStores = reactorState.get("dirtyStores");
  const nextState = currState.withMutations((state) => {
    getLoggerFunction(reactorState, "dispatchStart")(reactorState, actionType, payload);
    reactorState.get("stores").forEach((store, id) => {
      const currState2 = state.get(id);
      let newState;
      try {
        newState = store.handle(currState2, actionType, payload);
      } catch (e) {
        getLoggerFunction(reactorState, "dispatchError")(reactorState, e.message);
        throw e;
      }
      if (newState === void 0 && getOption(reactorState, "throwOnUndefinedStoreReturnValue")) {
        const errorMsg = "Store handler must return a value, did you forget a return statement";
        getLoggerFunction(reactorState, "dispatchError")(reactorState, errorMsg);
        throw new Error(errorMsg);
      }
      state.set(id, newState);
      if (currState2 !== newState) {
        dirtyStores = dirtyStores.add(id);
      }
    });
    getLoggerFunction(reactorState, "dispatchEnd")(reactorState, state, dirtyStores, currState);
  });
  const nextReactorState = reactorState.set("state", nextState).set("dirtyStores", dirtyStores).update("storeStates", (storeStates) => incrementStoreStates(storeStates, dirtyStores));
  return incrementId(nextReactorState);
}
function loadState(reactorState, state) {
  let dirtyStores = [];
  const stateToLoad = toImmutable({}).withMutations((stateToLoad2) => {
    (0, import_utils6.each)(state, (serializedStoreState, storeId) => {
      const store = reactorState.getIn(["stores", storeId]);
      if (store) {
        const storeState = store.deserialize(serializedStoreState);
        if (storeState !== void 0) {
          stateToLoad2.set(storeId, storeState);
          dirtyStores.push(storeId);
        }
      }
    });
  });
  const dirtyStoresSet = import_immutable6.default.Set(dirtyStores);
  return reactorState.update("state", (state2) => state2.merge(stateToLoad)).update("dirtyStores", (stores) => stores.union(dirtyStoresSet)).update("storeStates", (storeStates) => incrementStoreStates(storeStates, dirtyStores));
}
function addObserver(observerState, getter, handler) {
  const getterKey = getter;
  if (isKeyPath(getter)) {
    getter = fromKeyPath(getter);
  }
  const currId = observerState.get("nextId");
  const storeDeps = getStoreDeps(getter);
  const entry = import_immutable6.default.Map({
    id: currId,
    storeDeps,
    getterKey,
    getter,
    handler
  });
  let updatedObserverState;
  if (storeDeps.size === 0) {
    updatedObserverState = observerState.update("any", (observerIds) => observerIds.add(currId));
  } else {
    updatedObserverState = observerState.withMutations((map) => {
      storeDeps.forEach((storeId) => {
        let path = ["stores", storeId];
        if (!map.hasIn(path)) {
          map.setIn(path, import_immutable6.default.Set());
        }
        map.updateIn(["stores", storeId], (observerIds) => observerIds.add(currId));
      });
    });
  }
  updatedObserverState = updatedObserverState.set("nextId", currId + 1).setIn(["observersMap", currId], entry);
  return {
    observerState: updatedObserverState,
    entry
  };
}
function getOption(reactorState, option) {
  const value = reactorState.getIn(["options", option]);
  if (value === void 0) {
    throw new Error("Invalid option: " + option);
  }
  return value;
}
function removeObserver(observerState, getter, handler) {
  const entriesToRemove = observerState.get("observersMap").filter((entry) => {
    let entryGetter = entry.get("getterKey");
    let handlersMatch = !handler || entry.get("handler") === handler;
    if (!handlersMatch) {
      return false;
    }
    if (isKeyPath(getter) && isKeyPath(entryGetter)) {
      return isEqual(getter, entryGetter);
    }
    return getter === entryGetter;
  });
  return observerState.withMutations((map) => {
    entriesToRemove.forEach((entry) => removeObserverByEntry(map, entry));
  });
}
function removeObserverByEntry(observerState, entry) {
  return observerState.withMutations((map) => {
    const id = entry.get("id");
    const storeDeps = entry.get("storeDeps");
    if (storeDeps.size === 0) {
      map.update("any", (anyObsevers) => anyObsevers.remove(id));
    } else {
      storeDeps.forEach((storeId) => {
        map.updateIn(["stores", storeId], (observers) => {
          if (observers) {
            return observers.remove(id);
          }
          return observers;
        });
      });
    }
    map.removeIn(["observersMap", id]);
  });
}
function reset(reactorState) {
  const prevState = reactorState.get("state");
  return reactorState.withMutations((reactorState2) => {
    const storeMap = reactorState2.get("stores");
    const storeIds = storeMap.keySeq().toJS();
    storeMap.forEach((store, id) => {
      const storeState = prevState.get(id);
      const resetStoreState = store.handleReset(storeState);
      if (resetStoreState === void 0 && getOption(reactorState2, "throwOnUndefinedStoreReturnValue")) {
        throw new Error("Store handleReset() must return a value, did you forget a return statement");
      }
      if (getOption(reactorState2, "throwOnNonImmutableStore") && !isImmutableValue(resetStoreState)) {
        throw new Error("Store reset state must be an immutable value, did you forget to call toImmutable");
      }
      reactorState2.setIn(["state", id], resetStoreState);
    });
    reactorState2.update("storeStates", (storeStates) => incrementStoreStates(storeStates, storeIds));
    resetDirtyStores(reactorState2);
  });
}
function evaluate(reactorState, keyPathOrGetter) {
  const state = reactorState.get("state");
  if (isKeyPath(keyPathOrGetter)) {
    return evaluateResult(
      state.getIn(keyPathOrGetter),
      reactorState
    );
  } else if (!isGetter(keyPathOrGetter)) {
    throw new Error("evaluate must be passed a keyPath or Getter");
  }
  const cache = reactorState.get("cache");
  var cacheEntry = cache.lookup(keyPathOrGetter);
  const isCacheMiss = !cacheEntry || isDirtyCacheEntry(reactorState, cacheEntry);
  if (isCacheMiss) {
    cacheEntry = createCacheEntry(reactorState, keyPathOrGetter);
  }
  return evaluateResult(
    cacheEntry.get("value"),
    reactorState.update("cache", (cache2) => {
      return isCacheMiss ? cache2.miss(keyPathOrGetter, cacheEntry) : cache2.hit(keyPathOrGetter);
    })
  );
}
function serialize(reactorState) {
  let serialized = {};
  reactorState.get("stores").forEach((store, id) => {
    let storeState = reactorState.getIn(["state", id]);
    let serializedState = store.serialize(storeState);
    if (serializedState !== void 0) {
      serialized[id] = serializedState;
    }
  });
  return serialized;
}
function resetDirtyStores(reactorState) {
  return reactorState.set("dirtyStores", import_immutable6.default.Set());
}
function getLoggerFunction(reactorState, fnName) {
  const logger = reactorState.get("logger");
  if (!logger) {
    return noop;
  }
  const fn = logger[fnName];
  return fn ? fn.bind(logger) : noop;
}
function isDirtyCacheEntry(reactorState, cacheEntry) {
  const storeStates = cacheEntry.get("storeStates");
  return !storeStates.size || storeStates.some((stateId, storeId) => {
    return reactorState.getIn(["storeStates", storeId]) !== stateId;
  });
}
function createCacheEntry(reactorState, getter) {
  const args = getDeps(getter).map((dep) => evaluate(reactorState, dep).result);
  const value = getComputeFn(getter).apply(null, args);
  const storeDeps = getStoreDeps(getter);
  const storeStates = toImmutable({}).withMutations((map) => {
    storeDeps.forEach((storeId) => {
      const stateId = reactorState.getIn(["storeStates", storeId]);
      map.set(storeId, stateId);
    });
  });
  return CacheEntry({
    value,
    storeStates,
    dispatchId: reactorState.get("dispatchId")
  });
}
function incrementId(reactorState) {
  return reactorState.update("dispatchId", (id) => id + 1);
}
function incrementStoreStates(storeStates, storeIds) {
  return storeStates.withMutations((map) => {
    storeIds.forEach((id) => {
      const nextId = map.has(id) ? map.get(id) + 1 : 1;
      map.set(id, nextId);
    });
  });
}
function noop() {
}

// src/logging.js
var ConsoleGroupLogger = {
  dispatchStart: function(reactorState, type, payload) {
    if (!getOption(reactorState, "logDispatches")) {
      return;
    }
    if (console.group) {
      console.groupCollapsed("Dispatch: %s", type);
      console.group("payload");
      console.debug(payload);
      console.groupEnd();
    }
  },
  dispatchError: function(reactorState, error) {
    if (!getOption(reactorState, "logDispatches")) {
      return;
    }
    if (console.group) {
      console.debug("Dispatch error: " + error);
      console.groupEnd();
    }
  },
  dispatchEnd: function(reactorState, state, dirtyStores, previousState) {
    if (!getOption(reactorState, "logDispatches")) {
      return;
    }
    if (console.group) {
      if (getOption(reactorState, "logDirtyStores")) {
        console.log("Stores updated:", dirtyStores.toList().toJS());
      }
      if (getOption(reactorState, "logAppState")) {
        console.debug("Dispatch done, new state: ", state.toJS());
      }
      console.groupEnd();
    }
  },
  notifyStart: function(reactorState, observerState) {
  },
  notifyEvaluateStart: function(reactorState, getter) {
  },
  notifyEvaluateEnd: function(reactorState, getter, didCall, currValue) {
  },
  notifyEnd: function(reactorState, observerState) {
  }
};

// src/reactor.js
var import_utils7 = __toESM(require_utils());

// src/reactor/records.js
var import_immutable7 = __toESM(require_immutable());
var PROD_OPTIONS = (0, import_immutable7.Map)({
  logDispatches: false,
  logAppState: false,
  logDirtyStores: false,
  throwOnUndefinedActionType: false,
  throwOnUndefinedStoreReturnValue: false,
  throwOnNonImmutableStore: false,
  throwOnDispatchInDispatch: false
});
var DEBUG_OPTIONS = (0, import_immutable7.Map)({
  logDispatches: true,
  logAppState: true,
  logDirtyStores: true,
  throwOnUndefinedActionType: true,
  throwOnUndefinedStoreReturnValue: true,
  throwOnNonImmutableStore: true,
  throwOnDispatchInDispatch: true
});
var ReactorState = (0, import_immutable7.Record)({
  dispatchId: 0,
  state: (0, import_immutable7.Map)(),
  stores: (0, import_immutable7.Map)(),
  cache: DefaultCache(),
  logger: {},
  storeStates: (0, import_immutable7.Map)(),
  dirtyStores: (0, import_immutable7.Set)(),
  debug: false,
  options: PROD_OPTIONS
});
var ObserverState = (0, import_immutable7.Record)({
  any: (0, import_immutable7.Set)(),
  stores: (0, import_immutable7.Map)({}),
  observersMap: (0, import_immutable7.Map)({}),
  nextId: 1
});

// src/reactor.js
var Reactor = class {
  constructor(config = {}) {
    const debug = !!config.debug;
    const baseOptions = debug ? DEBUG_OPTIONS : PROD_OPTIONS;
    let logger = config.logger ? config.logger : {};
    if (!config.logger && debug) {
      logger = ConsoleGroupLogger;
    }
    const initialReactorState = new ReactorState({
      debug,
      cache: config.cache || DefaultCache(),
      logger,
      options: baseOptions.merge(config.options || {})
    });
    this.prevReactorState = initialReactorState;
    this.reactorState = initialReactorState;
    this.observerState = new ObserverState();
    this.ReactMixin = create_react_mixin_default(this);
    this.__batchDepth = 0;
    this.__isDispatching = false;
  }
  evaluate(keyPathOrGetter) {
    let { result, reactorState } = evaluate(this.reactorState, keyPathOrGetter);
    this.reactorState = reactorState;
    return result;
  }
  evaluateToJS(keyPathOrGetter) {
    return toJS(this.evaluate(keyPathOrGetter));
  }
  observe(getter, handler) {
    if (arguments.length === 1) {
      handler = getter;
      getter = [];
    }
    let { observerState, entry } = addObserver(this.observerState, getter, handler);
    this.observerState = observerState;
    return () => {
      this.observerState = removeObserverByEntry(this.observerState, entry);
    };
  }
  unobserve(getter, handler) {
    if (arguments.length === 0) {
      throw new Error("Must call unobserve with a Getter");
    }
    if (!isGetter(getter) && !isKeyPath(getter)) {
      throw new Error("Must call unobserve with a Getter");
    }
    this.observerState = removeObserver(this.observerState, getter, handler);
  }
  dispatch(actionType, payload) {
    if (this.__batchDepth === 0) {
      if (getOption(this.reactorState, "throwOnDispatchInDispatch")) {
        if (this.__isDispatching) {
          this.__isDispatching = false;
          throw new Error("Dispatch may not be called while a dispatch is in progress");
        }
      }
      this.__isDispatching = true;
    }
    try {
      this.reactorState = dispatch(this.reactorState, actionType, payload);
    } catch (e) {
      this.__isDispatching = false;
      throw e;
    }
    try {
      this.__notify();
    } finally {
      this.__isDispatching = false;
    }
  }
  batch(fn) {
    this.batchStart();
    fn();
    this.batchEnd();
  }
  registerStore(id, store) {
    console.warn("Deprecation warning: `registerStore` will no longer be supported in 1.1, use `registerStores` instead");
    this.registerStores({
      [id]: store
    });
  }
  registerStores(stores) {
    this.reactorState = registerStores(this.reactorState, stores);
    this.__notify();
  }
  replaceStores(stores) {
    this.reactorState = replaceStores(this.reactorState, stores);
  }
  serialize() {
    return serialize(this.reactorState);
  }
  loadState(state) {
    this.reactorState = loadState(this.reactorState, state);
    this.__notify();
  }
  reset() {
    const newState = reset(this.reactorState);
    this.reactorState = newState;
    this.prevReactorState = newState;
    this.observerState = new ObserverState();
  }
  __notify() {
    if (this.__batchDepth > 0) {
      return;
    }
    const dirtyStores = this.reactorState.get("dirtyStores");
    if (dirtyStores.size === 0) {
      return;
    }
    getLoggerFunction(this.reactorState, "notifyStart")(this.reactorState, this.observerState);
    let observerIdsToNotify = import_immutable8.default.Set().withMutations((set) => {
      set.union(this.observerState.get("any"));
      dirtyStores.forEach((id) => {
        const entries = this.observerState.getIn(["stores", id]);
        if (!entries) {
          return;
        }
        set.union(entries);
      });
    });
    observerIdsToNotify.forEach((observerId) => {
      const entry = this.observerState.getIn(["observersMap", observerId]);
      if (!entry) {
        return;
      }
      let didCall = false;
      const getter = entry.get("getter");
      const handler = entry.get("handler");
      getLoggerFunction(this.reactorState, "notifyEvaluateStart")(this.reactorState, getter);
      const prevEvaluateResult = evaluate(this.prevReactorState, getter);
      const currEvaluateResult = evaluate(this.reactorState, getter);
      this.prevReactorState = prevEvaluateResult.reactorState;
      this.reactorState = currEvaluateResult.reactorState;
      const prevValue = prevEvaluateResult.result;
      const currValue = currEvaluateResult.result;
      if (!import_immutable8.default.is(prevValue, currValue)) {
        handler.call(null, currValue);
        didCall = true;
      }
      getLoggerFunction(this.reactorState, "notifyEvaluateEnd")(this.reactorState, getter, didCall, currValue);
    });
    const nextReactorState = resetDirtyStores(this.reactorState);
    this.prevReactorState = nextReactorState;
    this.reactorState = nextReactorState;
    getLoggerFunction(this.reactorState, "notifyEnd")(this.reactorState, this.observerState);
  }
  batchStart() {
    this.__batchDepth++;
  }
  batchEnd() {
    this.__batchDepth--;
    if (this.__batchDepth <= 0) {
      this.__isDispatching = true;
      try {
        this.__notify();
      } catch (e) {
        this.__isDispatching = false;
        throw e;
      }
      this.__isDispatching = false;
    }
  }
};
var reactor_default = (0, import_utils7.toFactory)(Reactor);

// src/main.js
var import_immutable9 = __toESM(require_immutable());
var export_Immutable = import_immutable9.default;
export {
  export_Immutable as Immutable,
  LRUCache,
  reactor_default as Reactor,
  store_default as Store,
  create_react_mixin_default as createReactMixin,
  isGetter,
  isImmutable,
  isKeyPath,
  toImmutable,
  toJS
};
