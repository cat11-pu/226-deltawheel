// shift.js：算负载表（基线：一律给空表）
function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

export function badSizeError() {
  const error = new Error("size must be a positive integer");
  error.code = "E_BAD_SIZE";
  return error;
}

export function badTickError() {
  const error = new Error("ticks must be non-negative integers");
  error.code = "E_BAD_TICK";
  return error;
}

export function loadsOf(size, ticks) {
  if (!isPositiveInteger(size)) {
    throw badSizeError();
  }
  const loads = new Array(size).fill(0);
  if (ticks == null) {
    return loads;
  }
  for (const tick of ticks) {
    if (!isNonNegativeInteger(tick)) {
      throw badTickError();
    }
    loads[tick % size] += 1;
  }
  return loads;
}
