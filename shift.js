// shift.js：算负载表，一趟扫完，每格是落在该槽位的时刻个数
export function loadsOf(size, ticks) {
  if (!Number.isInteger(size) || size <= 0) {
    const error = new Error("size must be a positive integer");
    error.code = "E_BAD_SIZE";
    throw error;
  }
  const loads = new Array(size).fill(0);
  for (const tick of ticks) {
    if (!Number.isInteger(tick) || tick < 0) {
      const error = new Error("tick must be a non-negative integer");
      error.code = "E_BAD_TICK";
      throw error;
    }
    loads[tick % size] += 1;
  }
  return loads;
}
