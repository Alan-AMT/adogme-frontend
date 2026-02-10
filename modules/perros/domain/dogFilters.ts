export type DogFilters = {
  queryText: string | null;
  size: dogSize | null;
  sex: dogSex | null;
  puppy: boolean | null;
};

enum dogSize {
  small,
  mid,
  big,
}

enum dogSex {
  female,
  male,
}
