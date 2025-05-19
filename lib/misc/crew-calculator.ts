export class CrewCalculator {
  public static calculateCrew(date: Date): string {
    const baseDate = new Date("1999-02-21");
    const adjustedDate = new Date(date);
    adjustedDate.setHours(adjustedDate.getHours() - 6);

    // Add 56 days if the hour is >= 12
    if (adjustedDate.getHours() >= 12) {
      baseDate.setDate(baseDate.getDate() + 56);
    }

    const daysDifference = Math.floor(
      (adjustedDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const crewLetter = String.fromCharCode(
      (Math.floor(daysDifference / 4) % 4) + 65
    );

    return crewLetter;
  }

  public static calculateCurrentCrew(): string {
    return this.calculateCrew(new Date());
  }

  public static startOfTurn(d: Date): Date {
    return this.calculateStartOfShift(this.findStart(this.calculateCrew(d), d));
  }

  public static endOfTurn(d: Date): Date {
    return this.calculateEndOfShift(this.findStop(this.calculateCrew(d), d));
  }

  private static calculateEndOfShift(d: Date): Date {
    const startShift = this.calculateStartOfShift(d);
    const endShift = new Date(startShift);
    endShift.setHours(startShift.getHours() + 12);
    return endShift;
  }

  public static calculateStartOfShift(d: Date): Date {
    return this._calculateStartOfShift(d);
  }

  private static _calculateStartOfShift(d: Date): Date {
    const hour = d.getHours();
    const dateString = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

    if (hour >= 6 && hour < 18) {
      // Day shift (6am-6pm)
      const result = new Date(dateString);
      result.setHours(6, 0, 0, 0);
      return result;
    } else if (hour < 6) {
      // Night shift from previous day (6pm-6am)
      const yesterday = new Date(d);
      yesterday.setDate(d.getDate() - 1);
      const yesterdayString = `${
        yesterday.getMonth() + 1
      }/${yesterday.getDate()}/${yesterday.getFullYear()}`;
      const result = new Date(yesterdayString);
      result.setHours(18, 0, 0, 0);
      return result;
    } else {
      // Night shift (6pm-6am)
      const result = new Date(dateString);
      result.setHours(18, 0, 0, 0);
      return result;
    }
  }

  private static calculateStartOfPreviousShift(d: Date): Date {
    const hour = d.getHours();
    const dateString = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

    const yesterday = new Date(d);
    yesterday.setDate(d.getDate() - 1);
    const yesterdayString = `${
      yesterday.getMonth() + 1
    }/${yesterday.getDate()}/${yesterday.getFullYear()}`;

    if (hour > 6 && hour < 18) {
      // Current is day shift, previous was night shift
      const result = new Date(yesterdayString);
      result.setHours(18, 0, 0, 0);
      return result;
    } else if (hour < 6) {
      // Current is night shift, previous was day shift
      const result = new Date(yesterdayString);
      result.setHours(6, 0, 0, 0);
      return result;
    } else if (hour === 6) {
      // At 6am, previous shift was night shift
      const result = new Date(yesterdayString);
      result.setHours(18, 0, 0, 0);
      return result;
    } else if (hour === 18) {
      // At 6pm, previous shift was day shift
      const result = new Date(dateString);
      result.setHours(6, 0, 0, 0);
      return result;
    } else {
      // Fallback
      const result = new Date(dateString);
      result.setHours(18, 0, 0, 0);
      return result;
    }
  }

  public static startOfCurrentShift(): Date {
    return this.calculateStartOfShift(new Date());
  }

  public static endOfCurrentShift(): Date {
    return this.calculateEndOfShift(new Date());
  }

  public static startOfPreviousShift(d: Date): Date {
    return this.calculateStartOfPreviousShift(d);
  }

  private static findStart(crew: string, d: Date): Date {
    if (this.calculateCrew(d) !== crew) {
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      return nextDay;
    } else {
      const prevDay = new Date(d);
      prevDay.setDate(d.getDate() - 1);
      return this.findStart(crew, prevDay);
    }
  }

  private static findStop(crew: string, d: Date): Date {
    if (this.calculateCrew(d) !== crew) {
      const prevDay = new Date(d);
      prevDay.setDate(d.getDate() - 1);
      return prevDay;
    } else {
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      return this.findStop(crew, nextDay);
    }
  }

  public static beginningOfYear(year: number): Date {
    return new Date(year, 0, 1, 6, 0, 0);
  }

  public static endOfYear(year: number): Date {
    const nextYear = new Date(year + 1, 0, 1, 6, 0, 0);
    nextYear.setMilliseconds(nextYear.getMilliseconds() - 1);
    return nextYear;
  }

  public static startOfMonth(today: Date): Date {
    return new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
  }

  public static endOfMonth(today: Date): Date {
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    return new Date(today.getFullYear(), today.getMonth(), daysInMonth);
  }
}
