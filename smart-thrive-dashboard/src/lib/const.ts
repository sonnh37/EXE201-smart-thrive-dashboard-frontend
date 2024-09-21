class Const {
    private static readonly DASHBOARD = "";
    private static readonly ORDER = "album";
    private static readonly NEW = "new";
    private static readonly PACKAGE = "outfit";
    private static readonly COURSE = "service";
    private static readonly BLOG = "photo";

    static readonly DASHBOARD_URL = `/${Const.DASHBOARD}`;
    static readonly DASHBOARD_ORDER_URL = `/${Const.DASHBOARD}/${Const.ORDER}`;
    static readonly DASHBOARD_ORDER_NEW_URL = `${Const.DASHBOARD_ORDER_URL}/${Const.NEW}`;

    static readonly DASHBOARD_BLOG_URL = `/${Const.DASHBOARD}/${Const.BLOG}`;
    static readonly DASHBOARD_BLOG_NEW_URL = `${Const.DASHBOARD_BLOG_URL}/${Const.NEW}`;

    static readonly DASHBOARD_COURSE_URL = `/${Const.DASHBOARD}/${Const.COURSE}`;
    static readonly DASHBOARD_COURSE_NEW_URL = `${Const.DASHBOARD_COURSE_URL}/${Const.NEW}`;

    static readonly DASHBOARD_PACKAGE_URL = `/${Const.DASHBOARD}/${Const.PACKAGE}`;
    static readonly DASHBOARD_PACKAGE_NEW_URL = `${Const.DASHBOARD_PACKAGE_URL}/${Const.NEW}`;
}

export {Const};
