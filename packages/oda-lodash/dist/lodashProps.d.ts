declare const lodashProps = "\nmap: Path\nkeyBy: Path\neach: LodashOperations\ntrim: DummyArgument\nstringify: DummyArgument\ntoJSON: DummyArgument\n\n# Creates an array of elements split into groups the length of size.\n# If array can't be split evenly, the final chunk will be the remaining elements.\nchunk: Int\n\n# Creates a slice of array with n elements dropped from the beginning.\ndrop: Int\n\n# Creates a slice of array with n elements dropped from the end.\ndropRight: Int\n\n# Creates a slice of array with n elements taken from the beginning.\ntake: Int\n\n# Creates a slice of array with n elements taken from the end.\ntakeRight: Int\n\n# Recursively flatten array up to depth times.\nflattenDepth: Int\n\n# The inverse of `toPairs`; this method returns an object composed from key-value\n# pairs.\nfromPairs: DummyArgument\n\n# Gets the element at index n of array. If n is negative, the nth element from\n# the end is returned.\nnth: Int\n\n# Reverses array so that the first element becomes the last, the second element\n# becomes the second to last, and so on.\nreverse: DummyArgument\n\n# Creates a duplicate-free version of an array, in which only the first occurrence\n# of each element is kept. The order of result values is determined by the order\n# they occur in the array.\nuniq: DummyArgument\n\nuniqBy: Path\n\ncountBy: Path\nfilter: JSON\nreject: JSON\nfilterIf: Predicate\nrejectIf: Predicate\ngroupBy: Path\nsortBy: [Path!]\nmatch: RegExpr\nisMatch: RegExpr\n\nminBy: Path\nmaxBy: Path\nmeanBy: Path\nsumBy: Path\n\n# Converts all elements in array into a string separated by separator.\njoin: String\n\nget: Path\n# push selected item donw to the specified path\ndive: Path\n# get all fields of specified path to current object\nassign: [Path!]\nmapValues: Path\n\nconvert: ConvertTypeArgument\n\n# Creates an array of values corresponding to paths of object.\nat: [Path!]\n# Creates an array of own enumerable string keyed-value pairs for object.\ntoPairs: DummyArgument\n\n# Creates an object composed of the inverted keys and values of object.\n# If object contains duplicate values, subsequent values overwrite property\n# assignments of previous values.\ninvert: DummyArgument\n\ninvertBy: Path\n# Creates an array of the own enumerable property names of object.\nkeys: DummyArgument\n# Creates an array of the own enumerable string keyed property values of object.\nvalues: DummyArgument\n\nconcat: Path\ncompact: DummyArgument\n";
export default lodashProps;
//# sourceMappingURL=lodashProps.d.ts.map