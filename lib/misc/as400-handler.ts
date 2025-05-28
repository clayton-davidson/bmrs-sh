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

  public static as400DateTime(myDate?: Date): number {
    if (!myDate || !(myDate instanceof Date) || isNaN(myDate.getTime())) {
      return 0;
    }

    const year = (myDate.getFullYear() % 100) + 100;
    const month = myDate.getMonth() + 1;
    const day = myDate.getDate();
    const hour = myDate.getHours();
    const minute = myDate.getMinutes();
    const second = myDate.getSeconds();

    return (
      year * 10000000000 +
      month * 100000000 +
      day * 1000000 +
      hour * 10000 +
      minute * 100 +
      second
    );
  }
}
