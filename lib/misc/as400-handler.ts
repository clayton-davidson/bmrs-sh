export class As400Handler {
  public static as400Date(myDate?: Date): number {
    if (!myDate || !(myDate instanceof Date) || isNaN(myDate.getTime())) {
      return 0;
    }

    const year = (myDate.getFullYear() % 100) + 100;
    const month = myDate.getMonth() + 1;
    const day = myDate.getDate();

    return year * 10000 + month * 100 + day;
  }
}
