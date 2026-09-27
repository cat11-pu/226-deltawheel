// app.js：渲染结果
import { loadsOf } from "./shift.js";
import { planDelta } from "./deltawheel.js";

export function render(spec) {
  const size = spec.size || 0;
  const before = spec.before || [];
  const after = spec.after || [];
  const view = planDelta({ size: size, before: before, after: after });
  const loadsAfter = view.loads_after || [];
  const recount = loadsOf(size, after);
  const same = loadsAfter.length === recount.length
    && loadsAfter.every(function (count, spot) { return count === recount[spot]; });
  const quiet = planDelta({ size: size, before: before, after: before });
  return { changed: view.changed || [], changed_count: view.changed_count || 0,
           stale: !!view.stale, stale_slots: view.stale_slots || [], grew: view.grew || 0,
           loads_after: loadsAfter, size: size, count: size, consistent: same,
           quiet_count: (quiet.changed || []).length, quiet_stale: !!quiet.stale,
           tail: loadsOf(4, [7]).length };
}
