/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApplicative = require('../internal/isApplicative')
const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

const constant = require('../combinators/constant')

const _inspect = require('../funcs/inspect')

const isNothing =
  x => x === undefined || x === null

const _type=
  constant('Maybe')

const _of =
  Maybe

function Maybe(x) {
  if(!arguments.length) {
    throw new TypeError('Maybe: Must wrap something')
  }

  const type =
    _type

  const of =
    _of

  const option =
    n => either(constant(n), constant(x))

  const maybe =
    constant(option(undefined))

  const equals =
    m => isType(type(), m) && x === m.maybe()

  function inspect() {
    return either(
      constant(`Maybe.Nothing`),
      constant(`Maybe${_inspect(x)}`)
    )
  }

  function either(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Maybe.either: Requires both left and right functions')
    }

    return isNothing(x) ? f() : g(x)
  }

  function coalesce(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Maybe.coalesce: Requires both left and right functions')
    }

    return Maybe(either(f, g))
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.map: Function required')
    }

    return Maybe(either(constant(undefined), fn))
  }

  function ap(m) {
    const fn = option(constant(undefined))

    if(!isFunction(fn)) {
      throw new TypeError('Maybe.ap: Wrapped value must be a function')
    }
    else if(!isType(type(), m)) {
      throw new TypeError('Maybe.ap: Maybe required')
    }

    return m.map(fn)
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.chain: Function required')
    }

    if(isNothing(x)) {
      return Maybe(undefined)
    }

    const m = fn(x)

    if(!(m && isType(type(), m))) {
      throw new TypeError('Maybe.chain: function must return a Maybe')
    }

    return m
  }

  function jailSeq(type) {
    return function(x) {
      if(!isApplicative(x)) {
        throw new TypeError(`${type()}.sequence: Must wrap an Applicative`)
      }

      return x.map(Maybe)
    }
  }

  function sequence(af) {
    return either(
      constant(af(Maybe(undefined))),
      jailSeq(type)
    )
  }

  return {
    inspect, maybe, either, option,
    type, equals, coalesce, map, ap,
    of, chain, sequence
  }
}

Maybe.of =
  _of

Maybe.type =
  _type

module.exports = Maybe
