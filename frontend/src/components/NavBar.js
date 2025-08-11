import { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Divider,
  IconButton,
  InputBase,
  Badge,
  Drawer,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { theme } from "../theme";
import logo from "../assets/logo.jpg";
import { getUserFromToken } from "../App";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useCart } from "../CartContext";

export function NavBar({
  signInHover,
  setOpenSignIn,
  setSignInHover,
  setAnchorEl,
  handleSignOut,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();

  const isActive = (path) => {
    // Handle home route separately
    if (path === "/") {
      return location.pathname === path;
    }
    // For other routes, check if current path starts with the link path
    return location.pathname.startsWith(path);
  };

  const user = getUserFromToken();
  
  // Calculate total items in cart (sum of all quantities)
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  const navigationLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "FAQ", path: "/faq" },
    ...(user && user.is_admin ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  const handleSearch = (event) => {
    if (event.key === "Enter" || event.type === "click") {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        setDrawerOpen(false);
      }
    }
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: "background.paper", color: "text.primary" }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  color: "#002",
                }}
              >
                <img
                  src={logo}
                  alt="Dragon Lap Logo"
                  style={{
                    height: isMobile ? 38 : 50,
                    marginRight: 10,
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Typography
                  variant={isMobile ? "h7" : "h6"}
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
                    color: "primary.main",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Dragon Lap
                </Typography>
              </Link>
            </Box>
            {/* For Web nav */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      color: isActive(link.path)
                        ? theme.palette.primary.main
                        : "#000",
                      fontWeight: isActive(link.path) ? 600 : 500,
                      padding: "8px 16px",
                      position: "relative",
                      textDecoration: "none",
                      overflow: "hidden",
                      borderRadius: 4,
                      transition: "color 0.2s",
                      display: "inline-block",
                    }}
                    className="nav-link-underline"
                  >
                    <span style={{ position: "relative", zIndex: 1 }}>
                      {link.label}
                    </span>
                    <span
                      className="nav-underline-animated"
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: 4,
                        width: "100%",
                        height: 2,
                        backgroundColor: isActive(link.path)
                          ? theme.palette.primary.main
                          : "#000",
                        transform: isActive(link.path)
                          ? "scaleX(1)"
                          : "scaleX(0)",
                        transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
                        borderRadius: 2,
                        pointerEvents: "none",
                      }}
                    />
                  </Link>
                ))}
              </Box>
            )}
            {/* Search Bar - Desktop */}
            {!isMobile && (
              <Box sx={{ flex: 1, mx: 3, maxWidth: 500 }}>
                <Paper
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(e);
                  }}
                  sx={{
                    p: "4px 12px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 1,
                    boxShadow: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search laptops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    inputProps={{ "aria-label": "search laptops" }}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "8px", color: "primary.main" }}
                    aria-label="search"
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Box>
            )}
            {/* Action Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!isMobile && (
                <>
                  {user ? (
                    // Show user info and sign out when logged in
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", fontWeight: 500 }}
                      >
                        Welcome, {user.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleSignOut}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        Sign Out
                      </Button>
                    </Box>
                  ) : (
                    // Show sign in icon when not logged in
                    <IconButton
                      color="primary"
                      // onMouseEnter={(e) => {
                      //   setOpenSignIn(true);
                      //   setSignInHover(true);
                      //   setAnchorEl(e.currentTarget);
                      // }}
                      // onMouseLeave={() =>
                      //   setTimeout(() => {
                      //     if (!signInHover) {
                      //       setOpenSignIn(false);
                      //       setAnchorEl(null);
                      //     }
                      //   }, 100)
                      // }
                      onClick={() => navigate("/signin")}
                      sx={{
                        borderRadius: 2,
                        p: 1,
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "white",
                        },
                      }}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="primary"
                    onClick={() => navigate("/cart")}
                    sx={{
                      borderRadius: 2,
                      p: 1,
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    <Badge badgeContent={cartItemCount} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </>
              )}

              {isMobile && (
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{ color: "primary.main" }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: "background.paper" },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Mobile Search */}
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(e);
            }}
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              mb: 2,
              boxShadow: 1,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              inputProps={{ "aria-label": "search laptops" }}
            />
            <IconButton
              type="submit"
              sx={{ p: 1, color: "primary.main" }}
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton>
          </Paper>

          {/* Mobile Navigation */}
          <List>
            {navigationLinks.map((link) => (
              <ListItem
                button
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: "primary.main", minWidth: 40 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Mobile Action Icons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {user ? (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Welcome, {user.name}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                    handleSignOut();
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/signin");
                }}
                sx={{ textTransform: "none" }}
              >
                Sign In
              </Button>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <IconButton
                color="primary"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/cart");
                }}
              >
                <Badge badgeContent={cartItemCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton color="primary">
                <Badge badgeContent={0} color="secondary">
                  <CompareArrowsIcon />
                </Badge>
              </IconButton>
              <IconButton color="primary">
                <Badge badgeContent={0} color="secondary">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
      {/* Animated underline styles */}
      <style>
        {`
          .nav-link-underline:hover {
            color: #1976d2 !important;
          }
          .nav-link-underline:hover .nav-underline-animated {
            transform: scaleX(1) !important;
            background-color: #1976d2 !important;
          }
          .nav-underline-animated {
            transform: scaleX(0);
            transition: transform 0.25s cubic-bezier(.4,0,.2,1);
          }
        `}
      </style>
    </>
  );
}
