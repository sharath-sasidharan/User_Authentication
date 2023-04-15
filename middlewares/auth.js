//! isAuthenticated function middleware verifying user
export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded._id);
      next();
    } else {
      return res.status(404).json({
        success: false,
        message: "Please Login first",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
