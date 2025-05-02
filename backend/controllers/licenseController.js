const User = require('../models/user.model');

// Update the license key for a user
exports.updateLicense = async (req, res) => {
  const userId = req.params.userId;
  const { licenseKey } = req.body;

  // Validate the license key format (e.g., AAAA-BBBB-CCCC-DDDD)
  const LICENSE_REGEX = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/;
  if (!licenseKey || !LICENSE_REGEX.test(licenseKey)) {
    return res.status(400).json({
      error: 'Invalid license key format. Expected format: AAAA-BBBB-CCCC-DDDD'
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { user_subscription: licenseKey },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating the license key:', error);
    res.status(500).json({ error: error.message });
  }
};

// Unsubscribe (delete license): sets the user_subscription field to an empty string
exports.unsubscribeLicense = async (req, res) => {
  const userId = req.params.userId;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { user_subscription: '' },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error unsubscribing license:', error);
    res.status(500).json({ error: error.message });
  }
};