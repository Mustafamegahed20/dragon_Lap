import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import ContactBar from "./ContactBar";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import SignInPopOver from "./SignInPopOver";

export default function RootLayout() {
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const [signInHover, setSignInHover] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ContactBar />
      <NavBar
        onSignInHover={() => setSignInHover(true)}
        onSignInLeave={() => setSignInHover(false)}
        openSignIn={openSignIn}
        signInHover={signInHover}
        anchorEl={anchorEl}
        setOpenSignIn={setOpenSignIn}
        setSignInHover={setSignInHover}
        setAnchorEl={setAnchorEl}
        handleSignOut={handleSignOut}
      />
      <SignInPopOver
        signInHover={signInHover}
        setSignInHover={setSignInHover}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        openSignIn={openSignIn}
        setOpenSignIn={setOpenSignIn}
      />
      <Box component="main" sx={{ flex: 1, bgcolor: "background.default" }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
