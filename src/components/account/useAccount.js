import React from "react";

const useAccount = ({ auth, db }) => {
  const saveUserData = async (input) => {
    return await db.collection("users").doc(auth().currentUser.uid).set(
      {
        first_name: input.firstName,
        last_name: input.lastName,
        number: input.number,
        companyName: input.companyName,
        update_at: new Date(),
      },
      { merge: true }
    );
  };
  const getUserData = async () => {
    return await db.collection("users").doc(auth().currentUser.uid).get();
  };

  return {
    saveUserData,
    getUserData,
  };
};

export default useAccount;
