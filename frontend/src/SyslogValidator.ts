/*
 * Validates the date.
 *
 * Date must be of the following formats:
 *    - MM dd, if dd >= 10
 *    - MM  d, if dd < 10
 * */
function validateDate(str: string): boolean {
  const expression: RegExp = new RegExp(
    "(Jan)|(Feb)|(Mar)|(Apr)|(May)|(Jun)|(Jul)|(Aug)|(Sep)|(Oct)|(Nov)|(Dec) (3[0-1]|[1-2][0-9]| [0-9])",
  );

  return expression.test(str);
}

/*
 * Validates the time.
 *
 * Time must be of the format hh:mm:ss
 * */
function validateTime(str: string): boolean {
  const expression: RegExp = new RegExp(
    "^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$",
  );
  return expression.test(str);
}

/*
 * Validates the hostname.
 *
 * Should either represent a DNS hostname or an IP address.
 * FQDNs should not be used. However, the since the user
 * is entering in the hostname, there is nothing stopping
 * them from entering in FQDNs. Validation for FQDNs is
 * not done. Trust in the user can be afforded since
 * not adhering to this rule doesn't actually affect
 * anything.
 * */
function validateHostname(str: string): boolean {
  if (!str) return false;
  const containsInvalidCharsExpression: RegExp = new RegExp(
    "[^A-Za-z0-9\\-\\.\\_]+",
  );
  return !containsInvalidCharsExpression.test(str);
}

/*
 * Validates the tag.
 *
 * The tag should be any number of alphanumeric characters
 * terminated by a non-alphanumeric character. The length
 * of the tag should not exceed 32 characters in total.
 * */
function validateTag(str: string): boolean {
  let char: string = "a";
  let seenNonAlphanumeric: boolean = false;
  const alphanumericExpression: RegExp = new RegExp("([a-z]|[A-Z]|[0-9])");
  let counter: number = 0;
  const MAX_MSG_LENGTH: number = 32;

  while (counter < str.length && counter <= MAX_MSG_LENGTH) {
    char = str.charAt(counter);
    counter++;
    if (!alphanumericExpression.test(char)) {
      seenNonAlphanumeric = true;
      break;
    }
  }

  // if counter !== str.length, then tag contains more than one non-alphanumberic
  return (
    seenNonAlphanumeric && counter === str.length && counter <= MAX_MSG_LENGTH
  );
}

function validateContent(str: string): boolean {
  // use truthy value of str
  if (str.trim()) return true;
  else return false;
}

/*
 * Wrapper function to perform the validation of all values.
 *
 * Returns a string array of all errors.
 * */
function validateAll(
  date: string,
  time: string,
  hostname: string,
  tag: string,
  content: string,
): string[] {
  const errorMessages: string[] = [];
  if (!validateDate(date)) errorMessages.push("Date not valid");
  if (!validateTime(time)) errorMessages.push("Time not in correct format");
  if (!validateHostname(hostname))
    errorMessages.push(
      "Hostname field is empty or contains invalid characters",
    );
  if (!validateTag(tag))
    errorMessages.push(
      "Tag not terminated by non-alphanumeric character, contains multiple non-alphanumeric characters, or exceeds 32 characters total",
    );
  if (!validateContent(content)) errorMessages.push("Content field is empty");

  return errorMessages;
}

export {
  validateDate,
  validateTime,
  validateHostname,
  validateTag,
  validateContent,
  validateAll,
};

/*
 * Function to perform the validation and generate the syslog message.
 * */
export default function generateSyslog(
  facility: number,
  severity: number,
  date: Date,
  time: string,
  hostname: string,
  tag: string,
  content: string,
  separateWithSpace: boolean,
): string | string[] {
  const month: string = date.toString().split(" ")[1];
  let day: string = date.toString().split(" ")[2];
  if (Number.parseInt(day) < 10) day = " " + Number.parseInt(day); // replace leading zero with space
  const errors: string[] = validateAll(
    month + " " + day,
    time,
    hostname,
    tag,
    content,
  );

  if (errors.length > 0) return errors;

  const pri: number = 8 * facility + severity;
  const header: string = `${month} ${day} ${time} ${hostname.trim()}`;
  const msg: string = `${tag}${separateWithSpace ? " " : ""}${content.trim()}`;

  return `<${pri}>${header} ${msg}`;
}
