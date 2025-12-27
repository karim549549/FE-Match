export interface StepData {
  number: number;
  label: string;
  encryptedDescription: string;
  decryptedDescription: string;
}

export const STEP_DATA: StepData[] = [
  {
    number: 1,
    label: "AVATAR SELECTION",
    encryptedDescription: "U0VMRUNUX09QRVJBVE9SX0FWQVRBUg==", // "SELECT_OPERATOR_AVATAR"
    decryptedDescription: "SELECT OPERATOR AVATAR",
  },
  {
    number: 2,
    label: "PERSONAL INFORMATION",
    encryptedDescription: "U0VUVVBfQkFTSUNfSU5GT1JNQVRJT04=", // "SETUP_BASIC_INFORMATION"
    decryptedDescription: "SETUP BASIC INFORMATION",
  },
  {
    number: 3,
    label: "LOCATION SELECTION",
    encryptedDescription: "U0VMRUNUX0RFUExPWU1FTlRfWk9ORT==", // "SELECT_DEPLOYMENT_ZONE"
    decryptedDescription: "SELECT DEPLOYMENT ZONE",
  },
  {
    number: 4,
    label: "ADDITIONAL STEP 4",
    encryptedDescription: "U1RFUF80X0RFU0NSSVBUSU9O", // "STEP_4_DESCRIPTION"
    decryptedDescription: "STEP 4 DESCRIPTION",
  },
  {
    number: 5,
    label: "ADDITIONAL STEP 5",
    encryptedDescription: "U1RFUF81X0RFU0NSSVBUSU9O", // "STEP_5_DESCRIPTION"
    decryptedDescription: "STEP 5 DESCRIPTION",
  },
];

