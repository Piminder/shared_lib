import MorgansWrapper from "./morgans";

export interface PhoneNumber {
  alpha2code: string;
  numericCode: string;
  phone: string;
}

export enum CountryCode {
  MZ = "+258",
  BR = "+55",
}

const Phone = {
  validate(numberPhone: string): PhoneNumber {
    let phoneNumber = `${numberPhone}`;
    if (typeof phoneNumber === "string") {
      phoneNumber = phoneNumber.replace(/[^\d]/g, "");
    } else {
      MorgansWrapper.log(`phoneNumber ${phoneNumber}  não é uma string.`);
    }

    let num = phoneNumber;

    if (phoneNumber.startsWith("258")) num = `+${phoneNumber}`;
    else if (!phoneNumber.startsWith("+258")) {
      num = `+258${phoneNumber}`;
    }

    return {
      alpha2code: Phone.get_alpha2_code(CountryCode.MZ),
      numericCode: CountryCode.MZ,
      phone: num,
    };
  },

  get_alpha2_code(countryCode: CountryCode | undefined): string {
    switch (countryCode) {
      case CountryCode.MZ:
        return "MZ";
      case CountryCode.BR:
        return "BR";
      default:
        return "";
    }
  },
};
