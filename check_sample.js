import fs from "node:fs";
import { loadsOf } from "./shift.js";
import { planDelta } from "./deltawheel.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/deltas.json", "utf8"));
const view = render(spec);

emit("变化槽位 =", JSON.stringify(view.changed));
emit("变化槽位数 =", view.changed_count);
emit("超预算 =", view.stale);
emit("超预算槽位 =", JSON.stringify(view.stale_slots));
emit("新增时刻数 =", view.grew);
emit("重排后负载 =", JSON.stringify(view.loads_after));
emit("槽位数 =", view.size);
emit("负载复核一致 =", view.consistent);
emit("空变动槽位数 =", view.quiet_count);
emit("空变动超预算 =", view.quiet_stale);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  planDelta({ size: 0, before: [], after: [] });
  emit("槽位数写错的错误码", "没有报错");
} catch (error) {
  emit("槽位数写错的错误码", error && error.code ? error.code : String(error.message));
}
try {
  planDelta({ size: 4, before: [], after: [-1] });
  emit("时刻写错的错误码", "没有报错");
} catch (error) {
  emit("时刻写错的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "变化槽位": [
    1,
    2,
    3
  ],
  "变化槽位数": 3,
  "超预算": true,
  "超预算槽位": [
    3
  ],
  "新增时刻数": 4,
  "重排后负载": [
    2,
    2,
    2,
    4
  ],
  "槽位数": 4,
  "负载复核一致": true,
  "空变动槽位数": 0,
  "空变动超预算": false,
  "槽位数写错的错误码": "E_BAD_SIZE",
  "时刻写错的错误码": "E_BAD_TICK"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
