// deltawheel.js：增量重排（基线：一律给空变动）
import { badSizeError, badTickError } from "./shift.js";

export function planDelta(spec) {
  const size = spec.size;
  const before = spec.before || [];
  const after = spec.after || [];
  if (!(Number.isInteger(size) && size > 0)) {
    throw badSizeError();
  }

  const loadsBefore = new Array(size).fill(0);
  const loadsAfter = new Array(size).fill(0);
  const total = Math.max(before.length, after.length);
  for (let i = 0; i < total; i += 1) {
    if (i < before.length) {
      const oldTick = before[i];
      if (!(Number.isInteger(oldTick) && oldTick >= 0)) {
        throw badTickError();
      }
      loadsBefore[oldTick % size] += 1;
    }
    if (i < after.length) {
      const newTick = after[i];
      if (!(Number.isInteger(newTick) && newTick >= 0)) {
        throw badTickError();
      }
      loadsAfter[newTick % size] += 1;
    }
  }

  const changed = [];
  for (let slot = 0; slot < size; slot += 1) {
    if (loadsBefore[slot] !== loadsAfter[slot]) {
      changed.push(slot);
    }
  }

  const stale = changed.length > 2;
  return {
    changed: changed,
    changed_count: changed.length,
    stale: stale,
    stale_slots: stale ? changed.slice(2) : [],
    grew: after.length - before.length,
    loads_after: loadsAfter
  };
}
