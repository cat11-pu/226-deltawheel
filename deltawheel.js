// deltawheel.js：增量重排，先算前后负载表，再逐格比对一趟
import { loadsOf } from "./shift.js";

const BUDGET = 2;

export function planDelta(spec) {
  const size = spec.size;
  const before = spec.before || [];
  const after = spec.after || [];
  const loadsBefore = loadsOf(size, before);
  const loadsAfter = loadsOf(size, after);
  const changed = [];
  for (let slot = 0; slot < size; slot += 1) {
    if (loadsBefore[slot] !== loadsAfter[slot]) changed.push(slot);
  }
  const stale = changed.length > BUDGET;
  return { changed: changed, changed_count: changed.length,
           stale: stale, stale_slots: stale ? changed.slice(BUDGET) : [],
           grew: after.length - before.length, loads_after: loadsAfter };
}
