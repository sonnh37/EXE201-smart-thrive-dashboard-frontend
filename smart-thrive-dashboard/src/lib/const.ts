class Const {
  private static readonly ORDER = "orders";
  private static readonly NEW = "new";
  private static readonly PACKAGE = "packages";
  private static readonly COURSE = "courses";
  private static readonly BLOG = "blogs";

  //#region URL FE

  static readonly URL_BASE = process.env.NEXT_PUBLIC_URL_BASE;

  static readonly URL_ORDER = `/${Const.ORDER}`;
  static readonly URL_ORDER_NEW = `${Const.URL_ORDER}/${Const.NEW}`;

  static readonly URL_BLOG = `/${Const.BLOG}`;
  static readonly URL_BLOG_NEW = `${Const.URL_BLOG}/${Const.NEW}`;

  static readonly URL_COURSE = `/${Const.COURSE}`;
  static readonly URL_COURSE_NEW = `${Const.URL_COURSE}/${Const.NEW}`;

  static readonly URL_PACKAGE = `/${Const.PACKAGE}`;
  static readonly URL_PACKAGE_NEW = `${Const.URL_PACKAGE}/${Const.NEW}`;
  //#endregion

  //#region API
  static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE + "/api";

  static readonly API_ORDER = `${this.API_BASE}/${Const.ORDER}`;
  static readonly API_ORDER_NEW = `${Const.API_ORDER}/${Const.NEW}`;

  static readonly API_BLOG = `${this.API_BASE}/${Const.BLOG}`;
  static readonly API_BLOG_NEW = `${Const.API_BLOG}/${Const.NEW}`;

  static readonly API_COURSE = `${this.API_BASE}/${Const.COURSE}`;
  static readonly API_COURSE_NEW = `${Const.API_COURSE}/${Const.NEW}`;

  static readonly API_PACKAGE = `${this.API_BASE}/${Const.PACKAGE}`;
  static readonly API_PACKAGE_NEW = `${Const.API_PACKAGE}/${Const.NEW}`;
  //#endregion
}

export { Const };
