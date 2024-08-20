import ansiColors from "ansi-colors";

/**
 * StrOut Print string 
 */
export default class StrOut {

  /**
   * @var ansiColors
   */
  str: typeof ansiColors;

  /**
   * Constructor
   */
  constructor() {
    this.str = ansiColors.create();
  }

  /**
   * Print string
   * @param str string
   * @param new_line boolean
   * @returns StrOut
   */
  out(str: string, new_line: boolean = true) {
    if (new_line) {
      console.log(str);
    } else {
      process.stdout.write(str);
    }

    return this;
  }

  /**
   * Print success string
   * @param str string
   * @param new_line boolean
   * @returns StrOut
   */
  outSuccess(str: string, new_line: boolean = true) {
    this.out(this.str.green(str), new_line);
    return this;
  }

  /**
   * Print danger string
   * @param str string
   * @param new_line boolean
   * @returns StrOut
   */
  outDanger(str: string, new_line: boolean = true) {
    this.out(this.str.red(str), new_line);
    return this;
  }

  /**
   * Print info string
   * @param str string
   * @param new_line boolean
   * @returns StrOut
   */
  outInfo(str: string, new_line: boolean = true) {
    this.out(this.str.cyan(str), new_line);
    return this;
  }

  /**
   * Print warning string
   * @param str string
   * @param new_line boolean
   * @returns StrOut
   */
  outWarning(str: string, new_line: boolean = true) {
    this.out(this.str.yellow(str), new_line);
    return this;
  }

  /**
   * Print session header
   * @param session_name string
   * @param typeOut string || null
   */
  outSession(session_name: string, typeOut: string | null = null) {
    const strLen = session_name.length || 50;
    let outType: string = 'out';

    switch (typeOut) {
      case 'success':
        outType = 'outSuccess';
        break;

      case 'info':
        outType = 'outInfo';
        break;

      case 'danger':
        outType = 'outDanger';
        break;

      case 'warning':
        typeOut = 'outWarning';
        break;

      case 'out':
      default:
        outType = 'out';
        break;
    }

    this[outType]('=='.padStart(strLen, '='));
    this[outType](`${session_name}`);
    this[outType]('='.padStart(strLen, '='));
  }
}