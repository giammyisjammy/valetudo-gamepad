type ExpectedType = number | string;
type MyRecord<Key extends ExpectedType, R> = { [K in Key]: R };
type MyPartialRecord<Key extends ExpectedType, R> = { [K in Key]?: R };

export function stronglyTypedEntries<Key extends ExpectedType, T>(
  o: MyRecord<Key, T>,
): [keyof typeof o, T][];
export function stronglyTypedEntries<Key extends ExpectedType, T>(
  o: MyPartialRecord<Key, T>,
): [keyof typeof o, T][];
export function stronglyTypedEntries<T>(
  o:
    | {
        [s: ExpectedType]: T;
      }
    | ArrayLike<T>,
): [ExpectedType, T][] { 
  return Object.entries(o) as [keyof typeof o, T][];
}
