const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

// ✅ In-memory seat data
const seats = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  status: 'available', // 'available' | 'locked' | 'booked'
  lockedBy: null,
  lockExpiry: null
}));

// 🕒 Function to clear expired locks automatically
function clearExpiredLocks() {
  const now = Date.now();
  seats.forEach(seat => {
    if (seat.status === 'locked' && seat.lockExpiry && seat.lockExpiry < now) {
      seat.status = 'available';
      seat.lockedBy = null;
      seat.lockExpiry = null;
    }
  });
}

// ✅ Route 1: Get all seats
app.get('/seats', (req, res) => {
  clearExpiredLocks();
  res.json({
    message: 'Seat list retrieved successfully',
    data: seats
  });
});

// ✅ Route 2: Lock a seat (temporary hold)
app.post('/lock/:id', (req, res) => {
  clearExpiredLocks();
  const seatId = parseInt(req.params.id);
  const user = req.body.user;

  if (!user) {
    return res.status(400).json({ error: "User name is required to lock a seat" });
  }

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: "Seat not found" });

  if (seat.status === 'booked') {
    return res.status(400).json({ error: "Seat already booked" });
  }

  if (seat.status === 'locked' && seat.lockedBy !== user) {
    return res.status(400).json({ error: `Seat is currently locked by ${seat.lockedBy}` });
  }

  // Lock seat for 1 minute
  seat.status = 'locked';
  seat.lockedBy = user;
  seat.lockExpiry = Date.now() + 60000; // 1 minute lock
  res.json({ message: `Seat ${seatId} locked by ${user} for 1 minute`, data: seat });
});

// ✅ Route 3: Confirm a booking
app.post('/confirm/:id', (req, res) => {
  clearExpiredLocks();
  const seatId = parseInt(req.params.id);
  const user = req.body.user;

  if (!user) {
    return res.status(400).json({ error: "User name is required to confirm booking" });
  }

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: "Seat not found" });

  if (seat.status === 'booked') {
    return res.status(400).json({ error: "Seat already booked" });
  }

  if (seat.status !== 'locked' || seat.lockedBy !== user) {
    return res.status(400).json({ error: "Seat must be locked by you before confirming" });
  }

  // Confirm the booking
  seat.status = 'booked';
  seat.lockedBy = user;
  seat.lockExpiry = null;

  res.json({ message: `🎟️ Seat ${seatId} successfully booked by ${user}`, data: seat });
});

// ✅ Automatically clear locks every 10 seconds
setInterval(clearExpiredLocks, 10000);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Ticket Booking API running at http://localhost:${PORT}`);
});
