const User = require("../models/User");
const Franchise = require("../models/Franchise");
const bcrypt = require("bcryptjs");

exports.generateFranchiseCode = async (role = "franchise_partner") => {
  const prefix = role === "channel_partner" ? "CH" : "FR";

  const lastFranchise = await Franchise.findOne({
    franchiseCode: new RegExp(`^${prefix}\\d+$`),
  }).sort({ franchiseCode: -1 });

  let newNumber = 1;

  if (lastFranchise) {
    const lastNumber = parseInt(
      lastFranchise.franchiseCode.replace(prefix, ""),
      10
    );
    newNumber = lastNumber + 1;
  }

  return `${prefix}${String(newNumber).padStart(4, "0")}`;
};

// ✅ Corrected - uses partnerType properly
exports.createFranchiseAccount = async (enquiry) => {
  try {
    const role = enquiry.partnerType || "franchise_partner";

    const franchiseCode = await exports.generateFranchiseCode(role);

    const tempPassword = enquiry.email;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const partnerUser = await User.create({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      role,
      password: hashedPassword,
    });

    const franchise = await Franchise.create({
      enquiryId: enquiry._id,
      userId: partnerUser._id,
      franchiseCode,
      ownerName: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      partnerType: role,
      address: {
        city: enquiry.city || enquiry.location || "",
        state: enquiry.state || "",
      },
    });

    partnerUser.franchiseId = franchise._id;
    await partnerUser.save();

    console.log(`\n=== Partner Account Created ===`);
    console.log(`Type: ${role}`);
    console.log(`Code: ${franchiseCode}`);
    console.log(`Email: ${partnerUser.email}`);
    console.log(`Temp Password: ${tempPassword}`);
    console.log(`================================\n`);

    return {
      email: partnerUser.email,
      franchiseCode,
      tempPassword,
      role,
    };
  } catch (error) {
    console.error("Error creating partner account:", error);
    throw error;
  }
};
