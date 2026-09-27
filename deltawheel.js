// deltawheel.js：增量重排（基线：一律给空变动）
import { loadsOf } from "./shift.js";

export function planDelta(spec) {
  return { changed: [], changed_count: 0, stale: false, stale_slots: [], grew: 0, loads_after: [] };
}
