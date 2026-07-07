import { CalendarCheck, UsersRound, CheckCircle2 } from "lucide-react";
import { useState } from "react";

type ReservationPanelProps = {
  slots: string[];
};

type ReservationFormData = {
  name: string;
  phone: string;
  partySize: string;
  notes: string;
};

export function ReservationPanel({ slots }: ReservationPanelProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReservationFormData>({
    name: "",
    phone: "",
    partySize: "2",
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    
    setIsLoading(true);
    try {
      // Send POST request to API
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.name,
          phone: formData.phone,
          partySize: parseInt(formData.partySize),
          timeSlot: selectedSlot,
          notes: formData.notes || null,
        }),
      });
      
      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", phone: "", partySize: "2", notes: "" });
        setSelectedSlot(null);
      }, 3000);
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert("Failed to create reservation. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="reserve" className="section reservation-band">
      <div className="site-shell">
        <div className="section-header">
          <h2>Reservations designed for the operations dashboard.</h2>
          <p>
            Guests can request tables from the website while owners manage availability inside CafeOS.
          </p>
        </div>
        <div className="reserve-grid">
          <article className="reserve-card">
            <CalendarCheck size={28} />
            <h3>Pick a preferred slot</h3>
            <p>Select from available times and complete your reservation request.</p>
            <div className="slot-grid" style={{ marginTop: "1.5rem" }}>
              {slots.map((slot) => (
                <button
                  className="slot-button"
                  type="button"
                  key={slot}
                  style={{
                    backgroundColor: selectedSlot === slot ? "var(--copper)" : "rgba(255, 250, 242, 0.1)",
                    fontWeight: selectedSlot === slot ? "900" : "700",
                    transform: selectedSlot === slot ? "translateY(-2px)" : "none"
                  }}
                  onClick={() => handleSlotSelect(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </article>
          <article className="reserve-card">
            {isSubmitted ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center", padding: "1rem 0" }}>
                <CheckCircle2 size={48} style={{ color: "var(--mint)" }} />
                <h3>Reservation Request Sent!</h3>
                <p>We'll confirm your booking shortly. Thank you!</p>
              </div>
            ) : (
              <form className="form-grid" onSubmit={handleSubmit}>
                <UsersRound size={28} />
                <h3>Your Details</h3>
                <input
                  type="text"
                  name="name"
                  aria-label="Name"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "var(--cream)", borderRadius: "8px", padding: "0.75rem", fontSize: "1rem" }}
                />
                <input
                  type="tel"
                  name="phone"
                  aria-label="Phone number"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "var(--cream)", borderRadius: "8px", padding: "0.75rem", fontSize: "1rem" }}
                />
                <select
                  name="partySize"
                  aria-label="Party size"
                  required
                  value={formData.partySize}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "var(--cream)", borderRadius: "8px", padding: "0.75rem", fontSize: "1rem" }}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
                <textarea
                  name="notes"
                  aria-label="Notes"
                  placeholder="Any special requests?"
                  value={formData.notes}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "var(--cream)", borderRadius: "8px", padding: "0.75rem", fontSize: "1rem" }}
                />
                <button
          className="primary-button"
          type="submit"
          disabled={!selectedSlot || isLoading}
          style={{
            opacity: selectedSlot && !isLoading ? 1 : 0.5,
            cursor: selectedSlot && !isLoading ? "pointer" : "not-allowed"
          }}
        >
          {isLoading ? "Submitting..." : (selectedSlot ? `Reserve for ${selectedSlot}` : "Select a Time Slot")}
        </button>
              </form>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
