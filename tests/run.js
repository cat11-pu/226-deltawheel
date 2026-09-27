import assert from "node:assert";
import { loadsOf } from "../shift.js";
import { planDelta } from "../deltawheel.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("loadsOf returns a table", () => {
  assert.strictEqual(typeof loadsOf(2, [1, 2]).length, "number");
});

check("planDelta returns changed", () => {
  assert.ok(Array.isArray(planDelta({ size: 2, before: [], after: [] }).changed));
});

check("planDelta returns stale flag", () => {
  assert.strictEqual(typeof planDelta({ size: 2, before: [], after: [] }).stale, "boolean");
});

check("render counts slots", () => {
  assert.strictEqual(typeof render({ size: 2, before: [], after: [] }).count, "number");
});

check("render exposes consistent flag", () => {
  assert.strictEqual(typeof render({ size: 2, before: [], after: [] }).consistent, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
