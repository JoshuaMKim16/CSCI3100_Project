import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

// Admin Dashboard overall logic
const Dashboard = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [locationCount, setLocationCount] = useState(null);
  const [userData, setUserData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const adminId = parsedUser?._id || null;
    const token = parsedUser?.token || null;

    const baseUrl = "http://localhost:3000";
    const headers = token
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : { "Content-Type": "application/json" };

    // Fetch Admin Profile
    const fetchAdminProfile = async () => {
      if (!adminId) return;
      try {
        const response = await fetch(`${baseUrl}/api/users/${adminId}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch admin profile");
        const data = await response.json();
        setAdminProfile(data);
      } catch (error) {
        console.error("Admin profile fetch error:", error);
      }
    };

    // Fetch User Count
    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users`, { headers });
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = await response.json();
        setUserCount(users.length);
        const userDataByDate = users.reduce((acc, user) => {
          const date = new Date(user.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        setUserData(
          Object.keys(userDataByDate)
            .sort((a, b) => new Date(a) - new Date(b))
            .map((date) => ({
              date,
              total: userDataByDate[date],
            }))
        );
      } catch (error) {
        console.error("Users fetch error:", error);
      }
    };

    // Fetch location count
    const fetchLocationCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/locations`, { headers });
        if (!response.ok) throw new Error("Failed to fetch locations");
        const locations = await response.json();
        setLocationCount(locations.length);
        const locationDataByDate = locations.reduce((acc, location) => {
          const date = new Date(location.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        setLocationData(
          Object.keys(locationDataByDate)
            .sort((a, b) => new Date(a) - new Date(b))
            .map((date) => ({
              date,
              total: locationDataByDate[date],
            }))
        );
      } catch (error) {
        console.error("Locations fetch error:", error);
      }
    };

    // Fetch comment count
    const fetchCommentCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/comments`, { headers });
        if (!response.ok) throw new Error("Failed to fetch comments");
        const comments = await response.json();
        setCommentCount(comments.length);
        const commentDataByDate = comments.reduce((acc, comment) => {
          const date = new Date(comment.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        setCommentData(
          Object.keys(commentDataByDate)
            .sort((a, b) => new Date(a) - new Date(b))
            .map((date) => ({
              date,
              total: commentDataByDate[date],
            }))
        );
      } catch (error) {
        console.error("Comments fetch error:", error);
      }
    };

    Promise.all([
      fetchAdminProfile(),
      fetchUserCount(),
      fetchLocationCount(),
      fetchCommentCount(),
    ])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  const metricsChartData =
    userCount !== null && commentCount !== null && locationCount !== null
      ? [
          { name: "Users", total: userCount },
          { name: "Comments", total: commentCount },
          { name: "Locations", total: locationCount },
        ]
      : [];

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh", 
        width: "100%",
        overflowY: "auto", 
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, md: 3 },
        pb: { xs: 8, md: 12 }, 
        pr: { xs: 2, md: 4 },
        boxSizing: "border-box",
      }}
    >
      {/* Admin Profile & Dashboard Metrics */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Admin Profile
            </Typography>
            {adminProfile ? (
              <>
                <Typography variant="subtitle1" color="text.secondary">
                  Name: <strong>{adminProfile.name}</strong>
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Email: <strong>{adminProfile.email}</strong>
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Role: Admin
                </Typography>
                {adminProfile.bio && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {adminProfile.bio}
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body1">
                Unable to load admin profile.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Dashboard Metrics
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8884d8">
                    <LabelList
                      dataKey="total"
                      position="top"
                      style={{ fill: "#000" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2, minWidth: "300px" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              New Users Over Time
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2, minWidth: "300px" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              New Comments Over Time
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2, minWidth: "300px" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              New Locations Over Time
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;