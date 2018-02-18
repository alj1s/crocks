# Pair

```haskell
Pair a b
```

`Pair` allows the ability to represent (2) distinct values of different types.
Much like how `Either` is known as canonical Sum Type and defines the basis for
all other Sum Types that ship with `crocks`, `Pair` is known as the canonical
Product Type and also at the heart of all Product Types in `crocks`.

As `Pair` is a `Bifunctor`, it can vary in each of the (2) types it represents.
When used as a normal `Functor`, `Pair` will always have a bias for the far
right or second value, matching the pattern of the other ADTs in `crocks`. When
mapped with a function, the function will only be applied to the second value,
and will leave the first value untouched.

`Pair` also provides the ability to use `ap` and `chain`, but in order to
combine the resulting instances in a predictable, repeatable fashion the first
values in the `Pair`s must be `Semigroup` instances of the same type. When
applied, `ap` and `chain` will concatenate the `Semigroup`s providing the result
of the concatenation in the first position of the resulting

```javascript
```

## Implements
`Setoid`, `Semigroup`, `Functor`,  `Bifunctor`, `Apply`, `Chain`,
`Traversable`, `Extend`

## Instance Methods

#### equals

```haskell
Pair a b ~> c -> Boolean
```

Used to compare the underlying values of (2) `Pair` instances for equality by
value. `equals` takes any given argument and returns `true` if the passed
arguments is a `Pair` with an underlying values both in the first and second are
equal to the underlying values in the first and second  of the `Maybe` the
method is being called on. If the passed argument is not a `Maybe` or the
underlying values are not equal, `equals` will return `false`.

```javascript
```

#### concat

```haskell
Semigroup s, t => Pair s t ~> Pair s t -> Pair s t
```

When both underlying values of a given `Pair` are fixed to a `Semigroup`,
`concat` can be used to concatenate another `Pair` instance with underlying
`Semigroup`s of the same type and structure. Expecting a `Maybe` wrapping a
`Semigroup` of the same type, `concat` will give back a new `Pair` instance
wrapping the result of combining the underlying `Semigroup` instances.

```javascript
```

#### map

```haskell
Pair c a ~> (a -> b) -> Pair c b
```

Used to apply transformations to values to the second portion of a given `Pair`
instance. `map` takes a function that it will lift into the context of the
`Pair` and apply to it second value in the `Pair`, returning a new `Pair`
instance. The new instance will contain the result of mapping in the second,
leaving the value in the first untouched. If you need to map the first value,
[`bimap`](#bimap) can be used instead.

```javascript
```

#### bimap

```haskell
Pair a b ~> ((a -> c), (b -> d)) -> Pair c d
```

The types and values that make up a `Pair` can vary independently in both the
first and second portions of the `Pair`. While [`map`](#map) can be used to
apply these transformations, `bimap` allows for independent transformations
on both sides, in parallel.

`bimap` takes (2) mapping functions as its arguments. The first function is used
to map the first, while the second maps the second. `Pair` only provides a
means to map the second's value exclusively using [`map`](#map). If the need
arises to map the first portion exclusively, use `bimap` passing the mapping
function to the first argument and an `identity` to the second.

```javascript
```

#### ap

```haskell
Semigroup s => Pair s (a -> b) ~> Pair s a -> Pair s b
```

Short for apply, `ap` is used to apply a `Pair` instance containing a value on
its second portion to another `Pair` instance that contains a function in its
second portion. The result of this application provides a new `Pair` instance
containing the result in the second portion. `ap` requires that it is called on
an instance that wraps a curried polyadic function in the second.

An additional constraint when using `ap` is that the `Pair` must contain a
`Semigroup` instance in its first. This is required for both the `Pair` with
the function and the `Pair` with the value to be applied. With both `Semigroups`
being of the same type.

```javascript
```

#### chain

```haskell
Semigroup s => Pair s a ~> (a -> Pair s b) -> Pair s b
```

Combining a sequential series of transformations that allows for custom
accumulation in addition to transforming a value. `chain` requires a `Pair`
returning function that contains a `Semigroup` in its first position. As an
additional requirement, is that instances of the same `Semigroup` must occupy
the first position of the source `Pair` and the `Pair` returned by the function.

```javascript
```

#### sequence

```haskell
Applicative TypeRep t, Apply f => Pair a (f b) ~> (t | (b -> f b)) -> f (Pair a b)
```

When an instance of `Pair` wraps an `Apply` instance in its second position,
`sequence` can be used to swap the type sequence. `sequence` requires either an
`Applicative TypeRep` or an `Apply` returning function is provided for its argument.

While it is not a requirement that the first position be occupied by a
`Semigroup`, in having an instance there sequencing back on a data structure
with multiple items can allow for accumulation then sequencing back.

`sequence` can be derived from [`traverse`](#traverse) by passing it an
`identity` function (`x => x`).

```javascript
```

#### traverse

```haskell
Applicative TypeRep t, Apply f => Pair a b ~> ((t | (b -> f b)), (b -> f c)) -> f (Pair a c)
```

Used to apply the "effect" of an `Apply` to a value in the second position of
a `Pair`, `traverse` combines both the "effects" of the `Apply` and the `Pair`
by returning a new instance of the `Apply`, wrapping the result of the
`Apply`s "effect" on the value in the second position of the `Pair`.

`traverse` requires either an `Applicative TypeRep` or an `Apply` returning
function as its first argument and a function that is used to apply the "effect"
of the target `Apply` to the value in the second position of the `Pair`. The
"effect" will only be applied to second value and leaves the first value
untouched.Both arguments must return an instance of the target `Apply`.

```javascript
```

#### extend

```haskell
Pair a b ~> (Pair a b -> c) -> Pair a c
```

Used map the second position of a given `Pair` instance by taking the entire
`Pair` into consideration. `extend` takes a function the receives a `Pair` as
its input and returns a new `Pair` with the result of that function in the
second position, while leaving the value in the first position untouched.

```javascript
```

#### swap

```haskell
Pair a b ~> ((a -> c), (b -> d)) -> Pair d c
```

Used to map the value of a `Pair`s first position into the second position and
the second position into the first, `swap` takes (2) functions as its arguments.
The first function is used to map the value in the first position to the second,
while the second 'maps the second into the first'. If no mapping is required on
either side, then `identity` functions can be used in one or both arguments.

```javascript
```

#### fst

```haskell
Pair a b ~> () -> a
```

`fst` is one of (2) projection methods used to extract the values contained in
a given `Pair` instance. `fst` takes nothing as its input and will unwrap and
provide the value in the first position, throwing away the value in the second.
[`snd`](#snd) is the other projection function provided and is used to extract
the value in the second position.

```javascript
```

#### snd

```haskell
Pair a b ~> () -> b
```

`snd` is one of (2) projection methods used to extract the values contained in
a given `Pair` instance. `snd` takes nothing as its input and will unwrap and
provide the value in the second position, throwing away the value in the first.
[`fst`](#fst) is the other projection function provided and is used to extract
the value in the first position.

```javascript
```

#### toArray

```haskell
Pair a b ~> () -> [ a, b ]
```

While both [`fst`](#fst) and [`snd`](#snd) can be used to extract specific
values out of the structure of `Pair`, `toArray` extracts values but
maintains the structure. Taking nothing as its input, `toArray` will return an
`Array` of two values. The first value in the `Pair` will occupy the [0] index,
while the [1] index will house the second.

```javascript
```

#### merge

```haskell
Pair a b ~> ((a, b) -> c) -> c
```

Acting as a means to fold a given `Pair` over a binary operation, `merge` takes
a binary function as its sole argument. Using the function, `merge` will unwrap
each of its values and apply them to the function in order from first to second.
The result of the provided function is then provided as the overall result
for `merge`.

This method comes in handy when using a `Pair` as a means to run parallel
computations and combine their results into a final answer. Typically this
method works hand in hand with the [`branch`](#branch) helper function.

```javascript
```

## Helper Functions

#### branch

`crocks/Pair/branch`

```haskell
branch :: a -> Pair a a
```

Typically the starting point for handling parallel computations on a single
value, `branch` takes a single value of any type as its only argument. `branch`
then returns a `Pair` with the reference or value in both the first and second
positions.

Using `branch` can simplify how computations that depend on the same value are
constructed and encoded by removing the need to keep the original value in some
state that needs to be passed from function to function.

```javascript
```

#### toPairs

`crocks/Pair/toPairs`

```haskell
toPairs :: Object -> List (Pair String a)
```

[ desc ]

```javascript
```

## Pointfree Functions

#### fst (pointfree)

`crocks/Pair/fst`

```haskell
fst :: Pair a b -> a
```

[ desc ]

```javascript
```

#### merge (pointfree)

`crocks/Pair/merge`

```haskell
merge :: ((a, b) -> c) -> Pair a b -> c
```

[ desc ]

```javascript
```

#### snd (pointfree)

`crocks/Pair/snd`

```haskell
snd :: Pair a b -> b
```

[ desc ]

```javascript
```

## Transformation Functions

#### writerToPair

`crocks/Pair/writerToPair`

```haskell
writerToPair :: Monoid m => Writer m a -> Pair m a
writerToPair :: Monoid m => (a -> Writer m b) -> a -> Pair m b
```

[ desc ]

```javascript
```
