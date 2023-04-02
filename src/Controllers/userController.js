const userModel = require("../Models/userModel");
const {
  isValidString,
  isValidName,
  isValidMobile,
  isValidEmail,
  isValidPassword,
  isValidPincode,
  isIdValid,
} = require("../Validators/validator");
const jwt = require("jsonwebtoken");

//<<<<<<<<------------------- Create-User -------------------->>>>>>>>>>>>>

const createUser = async function (req, res) {
  try {
    let userData = req.body;
    let { title, name, phone, email, password, address } = userData;
    // Validaton for Body -
    if (Object.keys(userData).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Body should not be Empty" });
    }
    // Validaton for Title -
    if (!title) {
      res.status(400).send({ status: false, message: "title is required" });
    }
    let titles = ["Mr", "Mrs", "Miss"];
    if (!titles.includes(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter a valid title" });
    }
    // Validaton for Name -
    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "Name must reqired !" });
    }
    if (!isValidString(name) || !isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Valid Name!" });
    }
    // Validaton for Phone -
    if (!phone) {
      return res
        .status(400)
        .send({ status: false, message: "phone must reqired !" });
    }
    if (!isValidMobile(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Valid Phone !" });
    }
    const searchPhone = await userModel.findOne({ phone: phone });
    if (searchPhone) {
      return res
        .status(400)
        .send({ status: false, message: "Phone is already exist!" });
    }
    // Validaton for Email -
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email must reqired !" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Valid Email !" });
    }
    const searchEmail = await userModel.findOne({ email: email });
    if (searchEmail) {
      return res
        .status(400)
        .send({ status: false, message: "Email-Id is already exist!" });
    }
    // Validaton for Password -
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password must reqired !" });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "Password Must contain atleast one Capial-letter, a special-character Min-length-8 and Maximum-15!",
        });
    }
    // Validaton for Address -
    if (address) {
      if (address.street) {
        if (!isValidString(userData.address.street)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter a valid Street" });
        }
      }
      if (address.city) {
        if (!isValidName(userData.address.city)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter Valid City !" });
        }
      }
      if (address.pincode) {
        if (!isValidPincode(userData.address.pincode)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter Valid Pincode !" });
        }
      }
    }

    const createUser = await userModel.create(userData);
    res
      .status(201)
      .send({ status: true, message: "Success", data: createUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//<<<<<<<<------------------- login-User -------------------->>>>>>>>>>>>>

const loginUser = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;
    // Validaton for Body -
    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "email and password is required" });
    }
    // Validaton for email -
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is Invalid" });
    }
    // Validaton for Body -
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    let user = await userModel.findOne({ email: email, password: password });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "email or password is incorrect" });
    }
    let token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "functionup-secret-key",
      { expiresIn: "30m" }
    );

    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, message: "Success", data: token });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//<<<<<<<<------------------- Update-User -------------------->>>>>>>>>>>>>

const updateUser = async function (req, res) {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter user id in params" });
    }
    // Validaton for Id -
    if (!isIdValid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "ParamsUserId is not Valid !" });
    }
    // Authorization
    let userData = await userModel.findById({ _id: userId, isDeleted: false });
    if (!userData) {
      return res.status(404).send({ status: false, message: "user not found" });
    }
    let checkUserId = userData._id;
    console.log(checkUserId);
    if (checkUserId.toString() !== req.decoded.userId) {
      return res
        .status(403)
        .send({ status: false, message: "you dont have access" });
    }
    const data = req.body;
    const { title, name, phone, email, password, address } = data;

    // Validaton for Body -
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide data for updation" });
    }
    // Validaton for title -
    if (title) {
      let titles = ["Mr", "Mrs", "Miss"];
      if (!titles.includes(title)) {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter a valid title" });
      }
    }
    // Validaton for name -
    if (name) {
      if (!isValidString(name) || !isValidName(name)) {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter Valid Name!" });
      }
    }
    // Validaton for phone -
    if (phone) {
      if (!isValidMobile(phone)) {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter Valid Phone !" });
      }
      const searchPhone = await userModel.findOne({ phone: phone });
      if (searchPhone) {
        return res
          .status(400)
          .send({ status: false, message: "Phone is already exist!" });
      }
    }
    // Validaton for email -
    if (email) {
      if (!isValidEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter Valid Email !" });
      }
      const searchEmail = await userModel.findOne({ email: email });
      if (searchEmail) {
        return res
          .status(400)
          .send({ status: false, message: "Email-Id is already exist!" });
      }
    }
    // Validaton for password -

    if (password) {
      if (!isValidPassword(password)) {
        return res
          .status(400)
          .send({
            status: false,
            message:
              "Password Must contain atleast one Capial-letter, a special-character Min-length-8 and Maximum-15!",
          });
      }
    }
    // Validaton for address -
    if (address) {
      if (address.street) {
        if (!isValidString(userData.address.street)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter a valid Street" });
        }
      }
      if (address.city) {
        if (!isValidName(userData.address.city)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter Valid City !" });
        }
      }
      if (address.pincode) {
        if (!isValidPincode(userData.address.pincode)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter Valid Pincode !" });
        }
      }
    }

    const updateUserData = await userModel.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      {
        title: title,
        name: name,
        phone: phone,
        email: email,
        password: password,
        address: address,
      },
      { new: true }
    );
    if (!updateUserData) {
      return res
        .status(404)
        .send({ status: false, message: "User is already deleted" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: updateUserData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//<<<<<<<<------------------- Delete User -------------------->>>>>>>>>>>>>

const deleteUser = async function (req, res) {
  try {
    const userId = req.params.userId;

    if (!userId)
      return res
        .status(400)
        .send({ status: false, message: "bookId is required!" });
    if (!isIdValid(userId))
      return res
        .status(400)
        .send({ status: false, message: "bookId is not valid!" });

    // Authorization
    let userData = await userModel.findById({ _id: userId, isDeleted: false });
    if (!userData) {
      return res.status(404).send({ status: false, message: "user not found" });
    }
    let checkUserId = userData._id;
    console.log(checkUserId);
    console.log(userId);
    if (checkUserId.toString() !== req.decoded.userId) {
      return res
        .status(403)
        .send({ status: false, message: "you dont have access" });
    }
    const deleteUser = await userModel.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    if (!deleteUser)
      return res
        .status(404)
        .send({ status: false, message: "user does not exist" });
    return res
      .status(200)
      .send({ status: true, message: "user deleted succesfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
