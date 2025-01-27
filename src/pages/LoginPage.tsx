import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  UserCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  console.log("verificationId:", verificationId);
  const [loading, setLoading] = useState(false);
  console.log("setLoading:", setLoading);
  const [result, setResult] = useState<ConfirmationResult | null>(null);
  const [user, setUser] = useState<UserCredential | undefined>();
  const [reCaptcha, setReCaptcha] = useState<RecaptchaVerifier>();

  const navigate = useNavigate();

  useEffect(() => {
    const reCaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "normal",
      callback: (response: string) => {
        console.log("reCAPTCHA verified:", response);
      },
    });
    setReCaptcha(reCaptcha);
  }, []);

  const sendOtp = async () => {
    const newPhoneNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber.trim()}`;

    if (!/^\+?[1-9]\d{1,14}$/.test(newPhoneNumber)) {
      alert("Invalid phone number format.");
      return;
    }

    try {
      if (reCaptcha) reCaptcha.render();
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        newPhoneNumber,
        reCaptcha
      );
      console.log("confirmationResult:", confirmationResult);
      setVerificationId(confirmationResult.verificationId);
      alert("OTP sent!");
      setResult(confirmationResult); // user is set
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
      if (reCaptcha) reCaptcha.clear();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp == "") return toast.error("Please Enter the OTP");

    try {
      const userLoginSuccess = await result?.confirm(otp);
      console.log("userLoginSuccess:", userLoginSuccess);
      toast.success("user login successfully");
      setUser(userLoginSuccess);
      reCaptcha?.clear();
      navigate("/table");
    } catch (error) {
      console.log("error:", error);
      toast.error("Invalid OTP");
      reCaptcha?.clear();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: { md: "flex", xs: "block" },
      }}
    >
      {/* ----------------------left image-------------------------- */}
      <Box
        sx={{
          flex: 1,
        }}
      >
        <img
          src={"/MHD_Login_img.jpg"}
          alt="mhd-login-img"
          style={{
            width: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
          }}
        />
      </Box>
      {/* ------------------------------------Login with firebase---------- */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: { xs: 5 },
        }}
      >
        <Stack
          spacing={2}
          direction="column"
          alignItems="center"
          sx={{ marginTop: 4 }}
        >
          {/* ------------ SMS login-------- */}

          <Box
            sx={{
              // width: 400,
              width: "250px",
              margin: "50px auto",
              // padding: 3,
              // boxShadow: 3,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            {user ? (
              <Typography>User login Successfully</Typography>
            ) : !result ? (
              // send OTP to user
              <>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91-1234 567890"
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="Enter OTP"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={verifyOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </>
            )}

            <div id="recaptcha-container"></div>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
