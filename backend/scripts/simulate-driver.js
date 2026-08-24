// Moves a driver's live location in a straight line from an order's pickup
// point to its destination, posting updates the same way a real driver's
// phone would through /api/drivers/location. This is the primary way to
// demo realtime tracking locally - the browser's optional "Share My
// Location" toggle is a convenience, not the main mechanism.
//
// Usage:
//   node scripts/simulate-driver.js <driverEmail> <driverPassword> <orderId>
//
// The order must already be assigned to that driver and be PICKED_UP or
// IN_TRANSIT - location updates are rejected otherwise.

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const STEPS = 30;
const INTERVAL_MS = 2000;

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(`login failed: ${json.error.message}`);
  }
  return json.data.token;
}

async function getOrder(token, orderId) {
  const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(`could not load order: ${json.error.message}`);
  }
  return json.data.order;
}

async function postLocation(token, orderId, latitude, longitude) {
  const res = await fetch(`${BASE_URL}/api/drivers/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ orderId, latitude, longitude }),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(`location update failed: ${json.error.message}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const [email, password, orderId] = process.argv.slice(2);

  if (!email || !password || !orderId) {
    console.error("Usage: node scripts/simulate-driver.js <driverEmail> <driverPassword> <orderId>");
    process.exit(1);
  }

  const token = await login(email, password);
  const order = await getOrder(token, orderId);

  console.log(`Simulating driver movement for order ${order.id} (${order.status})`);
  console.log(`From: ${order.pickupAddress}`);
  console.log(`To:   ${order.destinationAddress}`);

  for (let step = 0; step <= STEPS; step++) {
    const fraction = step / STEPS;
    const latitude =
      order.pickupLatitude + (order.destinationLatitude - order.pickupLatitude) * fraction;
    const longitude =
      order.pickupLongitude + (order.destinationLongitude - order.pickupLongitude) * fraction;

    await postLocation(token, orderId, latitude, longitude);
    console.log(`step ${step}/${STEPS}: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);

    await sleep(INTERVAL_MS);
  }

  console.log("Reached the destination.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
