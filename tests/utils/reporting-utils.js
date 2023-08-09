exports.ReportUtil = class ReportUtil {

    constructor(page, testInfo){
        this.page = page;
        this.testInfo = testInfo;
    }
    async takeScreenshot(){
        await this.testInfo.attach("login success", {
            body: await this.page.screenshot(),
            contentType: "image/png",
          });
    }
};