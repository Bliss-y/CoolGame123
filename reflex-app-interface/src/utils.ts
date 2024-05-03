export function equalSet<T>(a: T[], b: T[], eql: (a: T, b: T) => boolean) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (!b.find(b => eql(b, a[i]))) {
      return false;
    }
  }
  return true;
}

export function equalArray<T>(a: T[], b: T[], eql: (a: T, b: T) => boolean) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (!eql(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

export function countIf<T>(seq: IterableIterator<T> | T[], predicate: (el: T) => boolean) {
  let count = 0;
  for (const el of seq) {
    if (predicate(el)) count++;
  }
  return count;
}

export function assort<T, K>(records: T[], keyFn: (_record: T) => K): Map<K, T[]> {
  const assortedRecords = new Map<K, T[]>();

  records.forEach(r => {
    const key = keyFn(r);
    const record = assortedRecords.get(key);

    if (record) {
      record.push(r);
    } else {
      assortedRecords.set(key, [r]);
    }
  });

  return assortedRecords;
}

export function reduce<A, B>(iter: IterableIterator<A> | A[], reducer: (acc: B, a: A) => B, initial: B): B {
  let acc = initial;
  for (const val of iter) {
    acc = reducer(acc, val);
  }
  return acc;
}
