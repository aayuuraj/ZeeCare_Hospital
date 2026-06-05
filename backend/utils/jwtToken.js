
export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
    const expireDays = Number(process.env.COOKIE_EXPIRE) || 7;
  
    res.status(statusCode).cookie(cookieName, token, {
      expires: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    }).json({
      success: true,
      message,
      user,
      token,
    });
  };
  