import { Microsoft } from "@mui/icons-material";
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
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
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
  const microsoftProvider = new OAuthProvider('microsoft.com');

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




  const loginWithMicrosoft = async () => {

    signInWithPopup(auth, microsoftProvider)
    .then((result) => {
      console.log('result:', result)
      // User is signed in.
      // IdP data available in result.additionalUserInfo.profile.
  
      // Get the OAuth access token and ID Token
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      console.log('accessToken:', accessToken)
      const idToken = credential?.idToken;
      console.log('idToken:', idToken)
    })
    .catch((error) => {
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
      // Handle error.
    });
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
        
        <Button
            onClick={loginWithMicrosoft}
            variant="outlined"
            startIcon={<Microsoft />} // Custom Microsoft Logo
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              color: "black",
              borderColor: "#A6A6A6",
              padding: "6px 12px",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              mt:2,           
                 backgroundColor: "white",
              "&:hover": {
                backgroundColor: "#f3f3f3",
                borderColor: "#999",
              },
            }}
          >
            Sign in with Microsoft
          </Button>
      </Box>


      <Stack direction={'row'} justifyContent={'end'} gap={1}>
        
        <Box>

        <Link to={
          '/upload'
        }>

          upload
        </Link>
        <Link to={
          '/table'
        }>

          Table
        </Link>
          </Box>
         </Stack>
    </Box>
  );
};

export default LoginPage;
