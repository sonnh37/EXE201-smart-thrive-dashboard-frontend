class Const {
    static readonly CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
    static readonly URL_BASE = process.env.NEXT_PUBLIC_URL_BASE;
    //#region API
    static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE + "api";
    //#endregion
    static readonly FADE_BOTTOM_ANIMATION_VARIANTS = {
        hidden: {opacity: 0, y: -10},
        show: {opacity: 1, y: 0, transition: {type: "spring"}}, // Tăng duration lên 0.5 giây
    };
    static readonly FADE_TOP_ANIMATION_VARIANTS = {
        hidden: {opacity: 0, y: 10},
        show: {opacity: 1, y: 0, transition: {type: "spring"}}, // Tăng duration lên 0.5 giây
    };
    static readonly FADE_RIGHT_ANIMATION_VARIANTS = {
        hidden: {opacity: 0, x: -10},
        show: {opacity: 1, x: 0, transition: {type: "spring"}}, // Tăng duration lên 0.5 giây
    };
    static readonly FADE_LEFT_ANIMATION_VARIANTS = {
        hidden: {opacity: 0, x: 10},
        show: {opacity: 1, x: 0, transition: {type: "spring"}}, // Tăng duration lên 0.5 giây
    };
    private static readonly ORDER = "orders";
    private static readonly PACKAGE = "packages";
    private static readonly BLOG = "blogs";
    private static readonly COURSE = "courses";
    static readonly URL_PACKAGE = `/${Const.PACKAGE}`;
    //#region URL FE
    
    static readonly URL_ORDER = `/${Const.ORDER}`;
    
    static readonly URL_BLOG = `/${Const.BLOG}`;
    static readonly URL_COURSE = `/${Const.COURSE}`;
    static readonly API_ORDER = `${this.API_BASE}/${Const.ORDER}`;
    private static readonly USER = "users";
    static readonly API_USER = `${this.API_BASE}/${Const.USER}`;
    static readonly API_BLOG = `${this.API_BASE}/${Const.BLOG}`;
    static readonly API_COURSE = `${this.API_BASE}/${Const.BLOG}`;
    static readonly API_PACKAGE = `${this.API_BASE}/${Const.BLOG}`;
    private static readonly NEW = "new";
    static readonly URL_ORDER_NEW = `${Const.URL_ORDER}/${Const.NEW}`;
    static readonly URL_BLOG_NEW = `${Const.URL_BLOG}/${Const.NEW}`;
    static readonly URL_COURSE_NEW = `${Const.URL_COURSE}/${Const.NEW}`;
    //#endregion
    static readonly URL_PACKAGE_NEW = `${Const.URL_PACKAGE}/${Const.NEW}`;
    static readonly API_ORDER_NEW = `${Const.API_ORDER}/${Const.NEW}`;
    static readonly API_USER_NEW = `${Const.API_USER}/${Const.NEW}`;
    static readonly API_BLOG_NEW = `${Const.API_BLOG}/${Const.NEW}`;
    static readonly API_COURSE_NEW = `${Const.API_COURSE}/${Const.NEW}`;
    static readonly API_PACKAGE_NEW = `${Const.API_PACKAGE}/${Const.NEW}`;
    
    
}

export {Const};
