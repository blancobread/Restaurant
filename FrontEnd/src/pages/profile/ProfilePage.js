import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import styles from "./ProfilePage.module.css";
export default function ProfilePage() {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  useEffect(() => {
    const fetchData = async () => {
      const savedToken = token || localStorage.getItem("token");
      if (!savedToken) {
        navigate("/login");
        return;
      }
      // profile
      const p = await fetch("http://localhost:5001/api/users/profile", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      const pd = await p.json();
      setProfile(pd.data);
      // reservations
      const r = await fetch("http://localhost:5001/api/users/reservations", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      const rd = await r.json();
      setReservations(rd.data || []);
    };
    fetchData();
  }, [token, navigate]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  if (!profile) return _jsx("p", { children: "Loading..." });
  return _jsxs("div", {
    className: styles.page,
    children: [
      _jsxs("div", {
        className: styles.header,
        children: [
          _jsxs("div", {
            className: styles.headerLeft,
            children: [
              _jsxs("h1", { children: ["Welcome back, ", profile.name, "!"] }),
              _jsxs("p", {
                className: styles.diner,
                children: ["Preferred Diner #: ", profile.preferred_diner_number],
              }),
            ],
          }),
          _jsxs("div", {
            className: styles.headerRight,
            children: [
              _jsxs("div", {
                className: styles.pointsBox,
                children: [
                  _jsx("p", { children: "Loyalty Points" }),
                  _jsx("h2", { children: profile.earned_points }),
                ],
              }),
              _jsx("p", {
                className: styles.pointsNote,
                children: "Earn 1 point for every $1 spent",
              }),
              _jsx("button", {
                onClick: handleLogout,
                className: styles.logout,
                children: "Logout",
              }),
            ],
          }),
        ],
      }),
      _jsx("button", {
        className: styles.cta,
        onClick: () => navigate("/reservation"),
        children: "+ Make a New Reservation",
      }),
      _jsxs("div", {
        className: styles.card,
        children: [
          _jsxs("div", {
            className: styles.tabs,
            children: [
              _jsx("button", {
                className: activeTab === "profile" ? styles.active : "",
                onClick: () => setActiveTab("profile"),
                children: "Profile",
              }),
              _jsx("button", {
                className: activeTab === "reservations" ? styles.active : "",
                onClick: () => setActiveTab("reservations"),
                children: "My Reservations",
              }),
            ],
          }),
          activeTab === "profile" &&
            _jsxs("div", {
              className: styles.profileGrid,
              children: [
                _jsxs("div", {
                  children: [
                    _jsx("label", { children: "Name" }),
                    _jsx("p", { children: profile.name }),
                  ],
                }),
                _jsxs("div", {
                  children: [
                    _jsx("label", { children: "Email" }),
                    _jsx("p", { children: profile.email }),
                  ],
                }),
                _jsxs("div", {
                  children: [
                    _jsx("label", { children: "Phone" }),
                    _jsx("p", { children: profile.phone }),
                  ],
                }),
                _jsxs("div", {
                  children: [
                    _jsx("label", { children: "Preferred Payment" }),
                    _jsx("p", { children: profile.preferred_payment_method }),
                  ],
                }),
                _jsxs("div", {
                  children: [
                    _jsx("label", { children: "Mailing Address" }),
                    _jsx("p", { children: profile.mailing_address || "N/A" }),
                  ],
                }),
                _jsxs("div", {
                  children: [
                    _jsx("label", { children: "Billing Address" }),
                    _jsx("p", {
                      children: profile.billing_same_as_mailing
                        ? "Same as mailing"
                        : profile.billing_address || "N/A",
                    }),
                  ],
                }),
              ],
            }),
          activeTab === "reservations" &&
            _jsx("div", {
              children:
                reservations.length === 0
                  ? _jsx("p", { className: styles.empty, children: "No reservations yet" })
                  : reservations.map((r) =>
                      _jsxs(
                        "div",
                        {
                          className: styles.reservationCard,
                          children: [
                            _jsx("span", { className: styles.status, children: r.status }),
                            _jsxs("div", {
                              className: styles.resGrid,
                              children: [
                                _jsxs("p", {
                                  children: [
                                    _jsx("b", { children: "Date:" }),
                                    " ",
                                    new Date(r.reservation_date).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }),
                                  ],
                                }),
                                _jsxs("p", {
                                  children: [
                                    _jsx("b", { children: "Time:" }),
                                    " ",
                                    new Date(r.reservation_time).toLocaleTimeString(undefined, {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    }),
                                  ],
                                }),
                                _jsxs("p", {
                                  children: [
                                    _jsx("b", { children: "Guests:" }),
                                    " ",
                                    r.number_of_guests,
                                  ],
                                }),
                                _jsxs("p", {
                                  children: [
                                    _jsx("b", { children: "Tables:" }),
                                    " ",
                                    r.reservation_tables
                                      ?.map((t) => t.restaurant_tables?.table_number)
                                      .join(", "),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        r.id,
                      ),
                    ),
            }),
        ],
      }),
    ],
  });
}
