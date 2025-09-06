import SignIn from "../pages/SignIn";
import { Popover } from "@mui/material";

const SignInPopOver = ({
  signInHover,
  setSignInHover,
  openSignIn,
  setOpenSignIn,
  anchorEl,
  setAnchorEl,
}) => {
  return (
    <Popover
      open={openSignIn}
      anchorEl={anchorEl}
      onClose={() => {
        setOpenSignIn(false);
        setAnchorEl(null);
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      PaperProps={{
        onMouseEnter: () => setSignInHover(true),
        onMouseLeave: () => {
          setSignInHover(false);
          setOpenSignIn(false);
          setAnchorEl(null);
        },
        sx: {
          p: 3,
          minWidth: 350,
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <SignIn />
    </Popover>
  );
};
export default SignInPopOver;
