
export const Formatter = {
  with_space(number) {
    const formatter = new Intl.NumberFormat(undefined, {
      useGrouping: true,
      groupingSeparator: ' '
    })
    return formatter.format(number);
  },

  Card: {
    number(card_number) {
      return `${card_number.slice(0, 4)} ${card_number.slice(4, 8)} ${card_number.slice(8, 12)} ${card_number.slice(12, 16)}`
    },
    expiration_date(date) {
      return `${date.slice(0, 2)}/${date.slice(2, 4)}`
    }
  },

  currency: (number) => {
    const formatter = new Intl.NumberFormat('fr-FR', {
      useGrouping: true,
    });
    const formattedNumber = formatter.format(number);

    return `${formattedNumber}`;
  },
  intl_format: (number) => {
    let numStr = number.toString();
    // Split the string into parts
    let parts = numStr.split('.');
    // First part is for the integer part
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    // If there is a decimal part, append it
    let formattedNumber = parts.length > 1 ? integerPart + '.' + parts[1] : integerPart;
    return formattedNumber;
  },
  formatPhoneNumber: (input, extension) => {
    if (input === null || input === '')
      return
    let str = input.toString();
    let regex;

    if (str.startsWith('+')) {
      regex = /^(\+\d{3})(\d{2})(\d{3})(\d{4})$/;
    } else if (str.length === 9) {
      regex = /^(\d{2})(\d{3})(\d{4})$/;
    } else if (str.length === 12) {
      regex = /^(\d{3})(\d{2})(\d{3})(\d{4})$/;
    } else {
      return "Invalid input format";
    }

    let formattedNumber = str.replace(regex, function(_, p1, p2, p3, p4) {
      if (p4) {
        return `${p1} ${p2} ${p3} ${p4}`;
      } else {
        return `${p1} ${p2} ${p3}`;
      }
    });

    if (extension && !formattedNumber.startsWith('+')) {
      formattedNumber = `+998 ${formattedNumber}`;
    }

    return formattedNumber;
  },

  percentage: (total, percentage, with_format) => {
    if (with_format) {
      return `${Formatter.intl_format(total * percentage / 100)}`
    }

    return (total * percentage) / 100
  }
}