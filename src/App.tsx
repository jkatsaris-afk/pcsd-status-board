import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, CircleDot } from "lucide-react";

const initialEmployees = [
  "Dennis Holmes",
  "Jordan McKinney",
  "Lola Montes",
  "Heidi Lusby",
  "Jared Jensen",
].map((name) => ({ name, status: "green", time: null }));

const statuses = {
  green: {
    label: "Available",
    dotColor: "#22c55e",
    borderColor: "#bbf7d0",
    buttonBg: "#16a34a",
    buttonText: "#ffffff",
    countColor: "#16a34a",
  },
  yellow: {
    label: "Busy",
    dotColor: "#facc15",
    borderColor: "#fde68a",
    buttonBg: "#eab308",
    buttonText: "#111827",
    countColor: "#ca8a04",
  },
  red: {
    label: "Do Not Disturb",
    dotColor: "#ef4444",
    borderColor: "#fecaca",
    buttonBg: "#dc2626",
    buttonText: "#ffffff",
    countColor: "#dc2626",
  },
  off: {
    label: "Not In",
    dotColor: "#6b7280",
    borderColor: "#d1d5db",
    buttonBg: "#6b7280",
    buttonText: "#ffffff",
    countColor: "#6b7280",
  },
};

function nextStatus(current) {
  if (current === "green") return "yellow";
  if (current === "yellow") return "red";
  if (current === "red") return "off";
  return "green";
}

function cardStyle(extra = {}) {
  return {
    background: "#ffffff",
    borderRadius: 24,
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e5e7eb",
    ...extra,
  };
}

function badgeStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 14px",
    borderRadius: 9999,
    fontSize: 14,
    fontWeight: 600,
    background: "#0f172a",
    color: "#ffffff",
  };
}

export default function App() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employee-statuses");
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("employee-statuses", JSON.stringify(employees));
  }, [employees]);

  const filtered = useMemo(() => {
    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const counts = useMemo(() => {
    return employees.reduce(
      (acc, employee) => {
        acc[employee.status] += 1;
        return acc;
      },
      { green: 0, yellow: 0, red: 0, off: 0 }
    );
  }, [employees]);

  const updateStatus = (name) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.name === name
          ? { ...employee, status: nextStatus(employee.status), time }
          : employee
      )
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: 24,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        boxSizing: "border-box",
      }}
    >
      <div
        style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 24 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={cardStyle({ border: "none" })}>
            <div style={{ padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 36, fontWeight: 800, color: "#0f172a" }}
                  >
                    PCSD District Office Live Status Board
                  </div>
                  <p style={{ marginTop: 8, fontSize: 16, color: "#475569" }}>
                    Tap an employee card to cycle status: Green → Yellow → Red →
                    Not In.
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/65f1c67213010f1ba434ab02/225a07e4-cf39-43f7-8129-70c9c3588093/PC.png?format=750w"
                    alt="PCSD Logo"
                    style={{ height: 80 }}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(120px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {Object.keys(statuses).map((key) => (
                      <div key={key} style={cardStyle({ padding: 16 })}>
                        <div style={{ fontSize: 14, color: "#64748b" }}>
                          {statuses[key].label}
                        </div>
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: statuses[key].countColor,
                          }}
                        >
                          {counts[key]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div
          style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}
        >
          <div style={cardStyle()}>
            <div style={{ padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                <Users size={20} />
                Controls
              </div>

              <div style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    pointerEvents: "none",
                  }}
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee"
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 16,
                    border: "1px solid #d1d5db",
                    paddingLeft: 40,
                    paddingRight: 12,
                    fontSize: 16,
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                  fontSize: 14,
                  color: "#475569",
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    background: "#f8fafc",
                    padding: 16,
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>
                    How it works
                  </div>
                  <div>
                    Tap a card once to move the employee to the next status.
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    background: "#f8fafc",
                    padding: 16,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 9999,
                        background: "#22c55e",
                        display: "inline-block",
                      }}
                    />
                    Green = Available
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 9999,
                        background: "#facc15",
                        display: "inline-block",
                      }}
                    />
                    Yellow = Busy
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 9999,
                        background: "#ef4444",
                        display: "inline-block",
                      }}
                    />
                    Red = Do Not Disturb
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 9999,
                        background: "#6b7280",
                        display: "inline-block",
                      }}
                    />
                    Gray = Not In
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((employee, index) => {
              const status = statuses[employee.status];

              return (
                <motion.button
                  key={employee.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateStatus(employee.name)}
                  style={{
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={cardStyle({
                      border: `2px solid ${status.borderColor}`,
                    })}
                  >
                    <div style={{ padding: 20 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 700 }}>
                            {employee.name}
                          </div>

                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 14,
                              color: "#64748b",
                            }}
                          >
                            <CircleDot size={16} />
                            Tap to update status
                          </div>

                          {employee.time && (
                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: "#94a3b8",
                              }}
                            >
                              Updated: {employee.time}
                            </div>
                          )}
                        </div>

                        <span
                          style={{
                            height: 20,
                            width: 20,
                            borderRadius: 9999,
                            background: status.dotColor,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 20,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={badgeStyle()}>{status.label}</span>

                        <span
                          style={{
                            borderRadius: 16,
                            padding: "10px 16px",
                            fontSize: 14,
                            fontWeight: 600,
                            background: status.buttonBg,
                            color: status.buttonText,
                          }}
                        >
                          Change Status
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
