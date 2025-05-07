export function removeItemBySplice<T>(arr: T[], index: number): T[] {
  // インデックスが有効かチェック
  if (index < 0 || index >= arr.length) {
    return arr;
  }
  // spliceは元の配列を変更し、削除された要素を返します
  arr.splice(index, 1);
  return arr;
}
